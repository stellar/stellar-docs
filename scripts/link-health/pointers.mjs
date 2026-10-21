// Check the pointers that the docs depend on: Discord invites and GitHub
// repositories.
//
// A link checker cannot catch these problems on its own. A Discord invite can
// stay valid but open an unrelated server (#2797), and GitHub answers a moved
// or archived repository with a working page. So this script:
//
// - asks Discord which server each invite in .github/link-health/pointers.json
//   opens, and compares it with the expected server,
// - flags invites and server links in the site sources that the manifest does
//   not list, or that it retired,
// - asks GitHub about the canonical repositories in the manifest and every
//   repository that docs/ links to, and flags the ones that are missing,
//   archived, or moved to a new name.
//
// A network error or a rate limit makes the result incomplete. It never counts
// as a pass.
//
// Usage: node scripts/link-health/pointers.mjs [--json out.json]
// Set GITHUB_TOKEN to raise the GitHub API rate limit.

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const MANIFEST = ".github/link-health/pointers.json";
const USER_AGENT =
  "stellar-docs-link-health (+https://github.com/stellar/stellar-docs)";

// Site sources that readers see: the docs, the site code, and the top-level
// guides. Meeting notes are historical records, so they are not scanned.
const SCAN_PATHS = [
  "docs",
  "src",
  "config",
  "static/llms.txt",
  "README.md",
  "CONTRIBUTING.md",
];
const SCAN_EXT = /\.(mdx?|tsx?|jsx?|json|txt)$/;

export const INVITE_RE =
  /\b(?:discord\.gg|discord(?:app)?\.com\/invite)\/([A-Za-z0-9-]+)/g;
export const CHANNEL_RE = /\bdiscord(?:app)?\.com\/channels\/(\d+)\b/g;
export const REPO_RE =
  /\bhttps?:\/\/github\.com\/([A-Za-z0-9-]+)\/([A-Za-z0-9_.-]+)/g;

// First path segments on github.com that are not user or organization names.
const NOT_OWNERS = new Set([
  "about",
  "account",
  "advisories",
  "apps",
  "codespaces",
  "collections",
  "contact",
  "customer-stories",
  "enterprise",
  "events",
  "explore",
  "features",
  "login",
  "marketplace",
  "new",
  "notifications",
  "orgs",
  "pricing",
  "readme",
  "search",
  "security",
  "settings",
  "site",
  "sponsors",
  "topics",
  "trending",
  "user-attachments",
]);

// Find every match of `re` in the files, with its line number.
export function scan(
  files,
  re,
  read = (f) => readFileSync(path.join(ROOT, f), "utf8"),
) {
  const hits = [];
  for (const file of files) {
    const lines = read(file).split("\n");
    lines.forEach((text, i) => {
      for (const m of text.matchAll(re))
        hits.push({ file, line: i + 1, match: m });
    });
  }
  return hits;
}

// Compare the invites and server links in the sources with the manifest.
export function classifyDiscord(inviteHits, channelHits, manifest) {
  const known = new Map(manifest.discord.map((d) => [d.code, d]));
  const retired = new Map(
    (manifest.retiredDiscord ?? []).map((d) => [d.code, d]),
  );
  const guilds = new Set(
    manifest.discord.map((d) => d.guildId).filter(Boolean),
  );
  const problems = [];
  for (const { file, line, match } of inviteHits) {
    const code = match[1];
    if (retired.has(code)) {
      problems.push({
        kind: "discord-retired",
        file,
        line,
        pointer: `discord.gg/${code}`,
        detail: retired.get(code).reason,
      });
    } else if (!known.has(code)) {
      problems.push({
        kind: "discord-unknown",
        file,
        line,
        pointer: `discord.gg/${code}`,
        detail: `${MANIFEST} does not list this invite. Confirm the server it opens, then add it to the manifest.`,
      });
    }
  }
  for (const { file, line, match } of channelHits) {
    if (!guilds.has(match[1])) {
      problems.push({
        kind: "discord-channel-server",
        file,
        line,
        pointer: match[0],
        detail: `the link opens server ${match[1]}, which ${MANIFEST} does not list`,
      });
    }
  }
  return problems;
}

async function getJson(fetchImpl, url, headers = {}) {
  const res = await fetchImpl(url, {
    headers: {
      "user-agent": USER_AGENT,
      accept: "application/json",
      ...headers,
    },
  });
  let body = null;
  try {
    body = await res.json();
  } catch {
    // Some error pages are not JSON. The status code is enough.
  }
  return { status: res.status, headers: res.headers, url: res.url, body };
}

// Ask Discord which server an invite opens.
export async function checkInvite(entry, fetchImpl = fetch) {
  const pointer = `discord.gg/${entry.code}`;
  let res;
  try {
    res = await getJson(
      fetchImpl,
      `https://discord.com/api/v10/invites/${encodeURIComponent(entry.code)}`,
    );
  } catch (e) {
    return { pointer, error: `network error: ${e.message}` };
  }
  if (res.status === 404) {
    return {
      pointer,
      problem: {
        kind: "discord-dead",
        pointer,
        detail:
          "Discord does not know this invite. It expired or someone deleted it.",
      },
    };
  }
  if (res.status !== 200 || !res.body?.guild) {
    return { pointer, error: `Discord answered HTTP ${res.status}` };
  }
  const { id, name } = res.body.guild;
  if (entry.guildId && id !== entry.guildId) {
    return {
      pointer,
      guild: { id, name },
      problem: {
        kind: "discord-wrong-server",
        pointer,
        detail: `the invite opens "${name}" (${id}), not the expected server ${entry.guildId}`,
      },
    };
  }
  return { pointer, guild: { id, name } };
}

// Collect the repositories that the files link to, as "owner/repo" keys.
export function collectRepos(hits) {
  const repos = new Map();
  for (const { file, line, match } of hits) {
    const owner = match[1];
    const name = match[2].replace(/\.git$/, "").replace(/\.+$/, "");
    if (!name || NOT_OWNERS.has(owner.toLowerCase())) continue;
    const key = `${owner}/${name}`.toLowerCase();
    if (!repos.has(key)) repos.set(key, { repo: `${owner}/${name}`, refs: [] });
    repos.get(key).refs.push({ file, line });
  }
  return repos;
}

// Ask GitHub whether a repository exists, moved, or is archived. fetch follows
// the API redirect for a moved repository, so a different full_name means the
// repository moved.
export async function checkRepo(repo, { token, fetchImpl = fetch } = {}) {
  const headers = { "x-github-api-version": "2022-11-28" };
  if (token) headers.authorization = `Bearer ${token}`;
  let res;
  try {
    res = await getJson(
      fetchImpl,
      `https://api.github.com/repos/${repo}`,
      headers,
    );
  } catch (e) {
    return { repo, error: `network error: ${e.message}` };
  }
  if (res.status === 404) {
    return {
      repo,
      problem: {
        kind: "repo-missing",
        pointer: repo,
        detail: "GitHub has no public repository at this path",
      },
    };
  }
  if (res.status !== 200 || !res.body?.full_name) {
    const remaining = res.headers?.get?.("x-ratelimit-remaining");
    return {
      repo,
      error: `GitHub answered HTTP ${res.status}${remaining === "0" ? " (rate limit)" : ""}`,
    };
  }
  if (res.body.full_name.toLowerCase() !== repo.toLowerCase()) {
    return {
      repo,
      problem: {
        kind: "repo-moved",
        pointer: repo,
        detail: `the repository moved to ${res.body.full_name}`,
      },
    };
  }
  if (res.body.archived) {
    return {
      repo,
      problem: {
        kind: "repo-archived",
        pointer: repo,
        detail:
          "the owner archived this repository, so it gets no more updates",
      },
    };
  }
  return { repo };
}

// Run tasks with a small concurrency limit, in input order.
export async function pool(items, limit, task) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await task(items[i]);
      }
    },
  );
  await Promise.all(workers);
  return results;
}

function trackedFiles() {
  const out = execFileSync("git", ["ls-files", "--", ...SCAN_PATHS], {
    cwd: ROOT,
    encoding: "utf8",
  });
  return out.split("\n").filter((f) => SCAN_EXT.test(f));
}

export async function run({
  token = process.env.GITHUB_TOKEN,
  fetchImpl = fetch,
} = {}) {
  const manifest = JSON.parse(readFileSync(path.join(ROOT, MANIFEST), "utf8"));
  const files = trackedFiles();
  const docsFiles = files.filter((f) => f.startsWith("docs/"));

  const problems = classifyDiscord(
    scan(files, INVITE_RE),
    scan(files, CHANNEL_RE),
    manifest,
  );
  const errors = [];

  const invites = await pool(manifest.discord, 2, (entry) =>
    checkInvite(entry, fetchImpl),
  );
  for (const r of invites) {
    if (r.problem) problems.push(r.problem);
    if (r.error) errors.push(`${r.pointer}: ${r.error}`);
  }

  const repos = collectRepos(scan(docsFiles, REPO_RE));
  for (const repo of manifest.repos ?? []) {
    const key = repo.toLowerCase();
    if (!repos.has(key)) repos.set(key, { repo, refs: [] });
  }
  const checked = await pool([...repos.values()], 6, (entry) =>
    checkRepo(entry.repo, { token, fetchImpl }),
  );
  checked.forEach((r, i) => {
    const entry = [...repos.values()][i];
    if (r.problem) problems.push({ ...r.problem, refs: entry.refs });
    if (r.error) errors.push(`${r.repo}: ${r.error}`);
  });

  return {
    complete: errors.length === 0,
    checked: {
      files: files.length,
      invites: invites.length,
      repos: repos.size,
    },
    invites: invites.map(({ pointer, guild }) => ({ pointer, guild })),
    problems,
    errors,
  };
}

async function main(argv) {
  const i = argv.indexOf("--json");
  const result = await run();
  if (i !== -1) {
    const out = argv[i + 1];
    mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
    writeFileSync(out, JSON.stringify(result, null, 2) + "\n");
  }
  const c = result.checked;
  console.log(
    `Scanned ${c.files} files, checked ${c.invites} Discord invites and ${c.repos} GitHub repositories.`,
  );
  for (const p of result.problems) {
    const where = p.file ? `${p.file}:${p.line} ` : "";
    console.log(`- [${p.kind}] ${where}${p.pointer}: ${p.detail}`);
  }
  for (const e of result.errors) console.log(`- [incomplete] ${e}`);
  if (!result.complete)
    console.log("Some checks did not run, so this result is incomplete.");
  return 0;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  process.exitCode = await main(process.argv.slice(2));
}
