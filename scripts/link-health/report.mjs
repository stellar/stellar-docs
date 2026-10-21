// Combine the link-health results into one Markdown report.
//
// Each input is optional. A missing or unreadable input marks that check as
// "did not run", so a failed check can never look like a clean result.
//
// Usage:
//   node scripts/link-health/report.mjs --lychee lychee.json \
//     --pointers pointers.json --redirects redirects.json \
//     --out report.md --status status.json [--run-url <url>]

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const MARKER = "<!-- link-health-report -->";
// GitHub rejects an issue body over 65,536 characters. Each list shows at most
// this many items, and the job summary of the run has the same report.
const MAX_ITEMS = 40;
const MAX_BODY = 60000;

// Show untrusted text (URLs, names from external APIs) as inline code.
export function code(text) {
  const clean = String(text)
    .replace(/[`\r\n]/g, "")
    .slice(0, 300);
  return "`" + clean + "`";
}

function readJson(file) {
  if (!file || !existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

// Turn lychee JSON output into broken and timed-out links, grouped by URL.
export function summarizeLychee(data) {
  if (!data || typeof data.total !== "number") return null;
  const group = (map) => {
    const byUrl = new Map();
    for (const [file, entries] of Object.entries(map ?? {})) {
      for (const e of entries) {
        if (!byUrl.has(e.url)) {
          // Keep the status short: the HTTP code, or the first clause of the error.
          const status =
            e.status?.code ??
            String(e.status?.text ?? "error")
              .split(" (")[0]
              .slice(0, 80);
          byUrl.set(e.url, { url: e.url, status: String(status), refs: [] });
        }
        const ref = `${file}:${e.span?.line ?? "?"}`;
        if (!byUrl.get(e.url).refs.includes(ref))
          byUrl.get(e.url).refs.push(ref);
      }
    }
    return [...byUrl.values()].sort((a, b) => a.url.localeCompare(b.url));
  };
  return {
    total: data.total,
    broken: group(data.error_map),
    timeouts: group(data.timeout_map),
  };
}

// Group removed routes by their first three path segments, so that one
// missing rule (for example, a whole old docs version) shows as one line.
export function groupRoutes(problems) {
  const groups = new Map();
  for (const p of problems) {
    const key = "/" + p.path.split("/").slice(1, 4).join("/");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  }
  return [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
}

function list(items, render) {
  const shown = items.slice(0, MAX_ITEMS).map(render);
  if (items.length > MAX_ITEMS)
    shown.push(
      `- ... and ${items.length - MAX_ITEMS} more. See the job summary of the run.`,
    );
  return shown.join("\n");
}

function refs(r) {
  const all = [
    ...new Set(
      r.map((x) => (typeof x === "string" ? x : `${x.file}:${x.line}`)),
    ),
  ];
  const head = all.slice(0, 3).map(code).join(", ");
  return all.length > 3 ? `${head} (+${all.length - 3} more)` : head;
}

export function buildReport({ lychee, pointers, redirects, runUrl }) {
  const links = summarizeLychee(lychee);
  const notRun = [];
  if (!links) notRun.push("external links (lychee)");
  else if (links.total === 0)
    notRun.push("external links (lychee found no links)");
  if (!pointers) notRun.push("Discord invites and GitHub repositories");
  if (!redirects) notRun.push("redirects");
  const partial = pointers && !pointers.complete ? pointers.errors : [];

  const pointerProblems = pointers?.problems ?? [];
  const redirectProblems = redirects?.problems ?? [];
  const counts = {
    brokenLinks: links?.broken.length ?? 0,
    timeouts: links?.timeouts.length ?? 0,
    pointers: pointerProblems.length,
    redirects: redirectProblems.length,
  };
  const findings = counts.brokenLinks + counts.pointers + counts.redirects;
  const incomplete = notRun.length > 0 || partial.length > 0;
  const status =
    findings > 0 ? "findings" : incomplete ? "incomplete" : "clean";

  const out = [MARKER, "## Link and pointer health", ""];
  out.push(
    "This report comes from the weekly `link-health` workflow. It updates this issue on each run and closes it when all checks pass.",
  );
  if (runUrl) out.push("", `Run: ${runUrl}`);
  out.push("", "| Check | Result |", "| --- | --- |");
  out.push(
    `| External links in \`docs/\` | ${links ? `${counts.brokenLinks} broken, ${counts.timeouts} timed out, ${links.total} checked` : "did not run"} |`,
  );
  out.push(
    `| Discord invites and GitHub repositories | ${pointers ? `${counts.pointers} problem(s)` : "did not run"} |`,
  );
  out.push(
    `| Redirects (\`nginx/includes/redirects.conf\`) | ${redirects ? `${counts.redirects} problem(s)` : "did not run"} |`,
  );

  if (incomplete) {
    out.push(
      "",
      "> [!WARNING]",
      "> Some checks did not finish, so this report is incomplete. A clean result needs a complete run.",
    );
    for (const n of notRun) out.push(`> - Did not run: ${n}.`);
    for (const e of partial.slice(0, 10)) out.push(`> - ${code(e)}`);
  }

  if (links?.broken.length) {
    out.push("", "### Broken external links", "");
    out.push(
      list(
        links.broken,
        (l) => `- ${code(l.url)} (${code(l.status)}) in ${refs(l.refs)}`,
      ),
    );
  }
  if (links?.timeouts.length) {
    out.push("", "### Timed out (check again before you change them)", "");
    out.push(
      list(links.timeouts, (l) => `- ${code(l.url)} in ${refs(l.refs)}`),
    );
  }
  if (pointerProblems.length) {
    out.push("", "### Discord invites and GitHub repositories", "");
    out.push(
      list(pointerProblems, (p) => {
        const where = p.file
          ? ` in ${refs([p])}`
          : p.refs?.length
            ? ` in ${refs(p.refs)}`
            : "";
        return `- **${p.kind}** ${code(p.pointer)}: ${code(p.detail)}${where}`;
      }),
    );
  }
  const targets = redirectProblems.filter((p) => p.kind !== "removed-route");
  const removed = redirectProblems.filter((p) => p.kind === "removed-route");
  if (targets.length) {
    out.push("", "### Redirects to pages that do not exist", "");
    out.push(
      list(
        targets,
        (p) =>
          `- \`nginx/includes/redirects.conf:${p.line}\` ${code(p.path)}: ${code(p.detail)}`,
      ),
    );
  }
  if (removed.length) {
    out.push("", "### Old URLs without a working redirect", "");
    out.push(
      "Each line groups old routes by path prefix. One rewrite rule can often fix a whole group.",
      "",
    );
    out.push(
      list(groupRoutes(removed), ([prefix, items]) => {
        const examples = items
          .slice(0, 2)
          .map((p) => code(p.path))
          .join(", ");
        return `- ${code(prefix)}: ${items.length} route(s), for example ${examples}`;
      }),
    );
  }
  if (status === "clean") out.push("", "All checks passed.");

  out.push(
    "",
    "<details><summary>How to fix</summary>",
    "",
    "- Broken link: point it at the current page, or remove it.",
    "- Moved or archived repository: link the new location, or say that the project is archived.",
    "- Discord: change `.github/link-health/pointers.json` first, then fix each place that this report lists.",
    '- Redirect: add or fix a `rewrite` in `nginx/includes/redirects.conf`. See "URLs are forever" in `CONTRIBUTING.md`.',
    "",
    "</details>",
  );

  let body = out.join("\n") + "\n";
  if (body.length > MAX_BODY)
    body =
      body.slice(0, MAX_BODY) + "\n\n... (cut to fit the issue size limit)\n";
  return { status, incomplete, counts, body };
}

function main(argv) {
  const arg = (name) => {
    const i = argv.indexOf(name);
    return i === -1 ? null : argv[i + 1];
  };
  const result = buildReport({
    lychee: readJson(arg("--lychee")),
    pointers: readJson(arg("--pointers")),
    redirects: readJson(arg("--redirects")),
    runUrl: arg("--run-url"),
  });
  for (const [flag, content] of [
    ["--out", result.body],
    [
      "--status",
      JSON.stringify(
        {
          status: result.status,
          incomplete: result.incomplete,
          counts: result.counts,
        },
        null,
        2,
      ) + "\n",
    ],
  ]) {
    const file = arg(flag);
    if (!file) continue;
    mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
    writeFileSync(file, content);
  }
  console.log(
    `Status: ${result.status}${result.incomplete ? " (incomplete)" : ""}`,
  );
  console.log(JSON.stringify(result.counts));
  return 0;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  process.exitCode = main(process.argv.slice(2));
}
