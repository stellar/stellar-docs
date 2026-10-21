// Keep one rolling GitHub issue for the link-health report.
//
// - Findings: create the issue, or update the body of the open one.
// - Clean: close the open issue with a comment.
// - Incomplete without findings: comment on the open issue, but never close
//   it, because a check that did not run proves nothing.
//
// Usage:
//   node scripts/link-health/issue.mjs --report report.md --status status.json \
//     [--run-url <url>] [--dry-run]
// Needs GITHUB_TOKEN (issues: write) and GITHUB_REPOSITORY. With --dry-run it
// only reads, and prints what it would do.

import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { MARKER } from "./report.mjs";

export const LABEL = "link-health";
export const TITLE = "Link and pointer health report";

export function decide(status, openIssue) {
  if (status === "findings") return openIssue ? "update" : "create";
  if (status === "clean") return openIssue ? "close" : "none";
  return openIssue ? "comment" : "none";
}

function client(repo, token, fetchImpl) {
  return async (method, route, body) => {
    const res = await fetchImpl(
      `https://api.github.com/repos/${repo}${route}`,
      {
        method,
        headers: {
          accept: "application/vnd.github+json",
          authorization: `Bearer ${token}`,
          "x-github-api-version": "2022-11-28",
          ...(body ? { "content-type": "application/json" } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      },
    );
    const data = res.status === 204 ? null : await res.json().catch(() => null);
    return { status: res.status, data };
  };
}

// Find the open report issue: our label, and our marker in the body.
export async function findOpenIssue(api) {
  const res = await api(
    "GET",
    `/issues?state=open&labels=${LABEL}&per_page=100`,
  );
  if (res.status !== 200)
    throw new Error(`listing issues failed with HTTP ${res.status}`);
  return (
    res.data.find((i) => !i.pull_request && i.body?.includes(MARKER)) ?? null
  );
}

export async function run({
  report,
  status,
  runUrl,
  dryRun,
  repo,
  token,
  fetchImpl = fetch,
  log = console.log,
}) {
  const api = client(repo, token, fetchImpl);
  const open = token ? await findOpenIssue(api) : null;
  const action = decide(status, open);
  log(
    `Status: ${status}. Open issue: ${open ? `#${open.number}` : "none"}. Action: ${action}.`,
  );
  if (dryRun || action === "none") return action;

  if (action === "create") {
    const label = await api("GET", `/labels/${LABEL}`);
    if (label.status === 404) {
      await api("POST", "/labels", {
        name: LABEL,
        color: "c5def5",
        description: "Weekly link and pointer health report",
      });
    }
    const res = await api("POST", "/issues", {
      title: TITLE,
      body: report,
      labels: [LABEL],
    });
    if (res.status !== 201)
      throw new Error(`creating the issue failed with HTTP ${res.status}`);
    log(`Created #${res.data.number}.`);
  } else if (action === "update") {
    const res = await api("PATCH", `/issues/${open.number}`, { body: report });
    if (res.status !== 200)
      throw new Error(
        `updating #${open.number} failed with HTTP ${res.status}`,
      );
    log(`Updated #${open.number}.`);
  } else if (action === "close") {
    const where = runUrl ? ` in ${runUrl}` : "";
    await api("POST", `/issues/${open.number}/comments`, {
      body: `All link-health checks passed${where}. Closing this issue.`,
    });
    const res = await api("PATCH", `/issues/${open.number}`, {
      state: "closed",
      state_reason: "completed",
      body: report,
    });
    if (res.status !== 200)
      throw new Error(`closing #${open.number} failed with HTTP ${res.status}`);
    log(`Closed #${open.number}.`);
  } else if (action === "comment") {
    const where = runUrl ? ` (${runUrl})` : "";
    await api("POST", `/issues/${open.number}/comments`, {
      body: `The latest link-health run did not finish all checks${where}, so this issue stays open. The next complete run updates it.`,
    });
    log(`Commented on #${open.number}.`);
  }
  return action;
}

async function main(argv) {
  const arg = (name) => {
    const i = argv.indexOf(name);
    return i === -1 ? null : argv[i + 1];
  };
  const dryRun = argv.includes("--dry-run");
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  if (!repo || (!token && !dryRun)) {
    console.error("Set GITHUB_REPOSITORY and GITHUB_TOKEN (or use --dry-run).");
    return 2;
  }
  const { status } = JSON.parse(readFileSync(arg("--status"), "utf8"));
  await run({
    report: readFileSync(arg("--report"), "utf8"),
    status,
    runUrl: arg("--run-url"),
    dryRun,
    repo,
    token,
  });
  return 0;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  process.exitCode = await main(process.argv.slice(2));
}
