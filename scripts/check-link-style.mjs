#!/usr/bin/env node
// Flags internal links that don't follow the site's link style: root-relative,
// with no file extension. For example, `/docs/learn/fundamentals/fees`, not
// `../fees.mdx`.
//
// It checks Markdown links and images, reference-style link definitions, and
// `href` attributes. Two things are flagged:
//   - relative targets (`./x`, `../x`, or a bare `x`): they resolve against the
//     page's URL, so they break when a page moves or is pulled in as a snippet.
//   - `.md` or `.mdx` on an internal target: Mintlify rewrites it on inline
//     links, but emits it as-is in reference definitions, which then 404.
//     `mint broken-links` resolves both forms as files, so it can't catch this.
// External URLs, `#anchors`, and code (fenced blocks and inline code spans)
// are ignored.
//
// Usage:
//   node scripts/check-link-style.mjs --staged       lines added in the index (pre-commit)
//   node scripts/check-link-style.mjs --base <ref>   lines added since <ref> (CI)
//   node scripts/check-link-style.mjs --all [PATH...] every line of the files (audits)
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const SCOPE = ["docs", "meetings", "snippets", "launch", "index.mdx", "sds-preview.mdx"];
const IS_DOC = /\.mdx?$/;
const FENCE = /^\s*(```|~~~)/;

const git = (...args) =>
  execFileSync("git", args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });

// Link targets in a line: [text](target), ![alt](target), [label]: target,
// and href="target".
function targets(line) {
  // Drop inline code spans, so `[x](../y)` in backticks is left alone.
  const text = line.replace(/(`+)[^`]*?\1/g, "");
  const found = [];
  for (const m of text.matchAll(/\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)) found.push(m[1]);
  const def = text.match(/^\s{0,3}\[[^\]]+\]:\s*<?(\S+?)>?(?:\s+["'(].*)?$/);
  if (def) found.push(def[1]);
  for (const m of text.matchAll(/\bhref=["']([^"']+)["']/g)) found.push(m[1]);
  return found;
}

function problem(target) {
  if (/^(#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(target)) return null; // anchor, scheme, protocol-relative
  const path = target.split(/[?#]/)[0];
  if (!target.startsWith("/")) return "relative link: use a root-relative path such as /docs/...";
  if (/\.mdx?$/i.test(path)) return "drop the .md/.mdx extension";
  return null;
}

// Line numbers (1-based) that sit inside fenced code blocks.
function fencedLines(lines) {
  const inside = new Set();
  let fence = null;
  lines.forEach((line, i) => {
    const m = line.match(FENCE);
    if (fence) {
      inside.add(i + 1);
      if (m && m[1] === fence) fence = null;
    } else if (m) {
      fence = m[1];
      inside.add(i + 1);
    }
  });
  return inside;
}

// Added line numbers per file, from a zero-context diff.
function addedLines(diffArgs) {
  const out = new Map();
  let file = null;
  for (const line of git("diff", "-U0", "--no-color", "--diff-filter=AMR", ...diffArgs, "--", ...SCOPE).split("\n")) {
    if (line.startsWith("+++ ")) {
      file = line.startsWith("+++ b/") ? line.slice(6) : null;
      if (file && !IS_DOC.test(file)) file = null;
      if (file && !out.has(file)) out.set(file, new Set());
      continue;
    }
    const hunk = file && line.match(/^@@ -\S+ \+(\d+)(?:,(\d+))? @@/);
    if (hunk) {
      const start = Number(hunk[1]);
      const count = hunk[2] === undefined ? 1 : Number(hunk[2]);
      for (let n = start; n < start + count; n++) out.get(file).add(n);
    }
  }
  return out;
}

const args = process.argv.slice(2);
let files; // Map<path, Set<line> | null> (null = every line)
let read = (path) => fs.readFileSync(path, "utf8");

if (args[0] === "--staged") {
  files = addedLines(["--cached"]);
  read = (path) => git("show", `:${path}`); // the staged version, not the working tree
} else if (args[0] === "--base" && args[1]) {
  files = addedLines([args[1], "HEAD"]);
} else if (args[0] === "--all") {
  const paths = args.length > 1 ? args.slice(1) : SCOPE;
  files = new Map(
    git("ls-files", "--", ...paths)
      .split("\n")
      .filter((p) => IS_DOC.test(p))
      .map((p) => [p, null]),
  );
} else {
  console.error("Usage: check-link-style.mjs --staged | --base <ref> | --all [PATH...]");
  process.exit(2);
}

const annotate = process.env.GITHUB_ACTIONS === "true";
let count = 0;
for (const [path, wanted] of files) {
  if (wanted && wanted.size === 0) continue;
  const lines = read(path).split("\n");
  const fenced = fencedLines(lines);
  lines.forEach((line, i) => {
    const n = i + 1;
    if ((wanted && !wanted.has(n)) || fenced.has(n)) return;
    for (const target of targets(line)) {
      const why = problem(target);
      if (!why) continue;
      count++;
      if (annotate) console.log(`::error file=${path},line=${n}::${why} (${target})`);
      else console.log(`${path}:${n}: ${why}\n    ${target}`);
    }
  });
}

if (count) {
  console.log(`\n✖ ${count} internal link${count === 1 ? "" : "s"} not in the site's link style.`);
  console.log("  Use root-relative paths without extensions, for example /docs/learn/fundamentals/fees#base-fee.");
  process.exit(1);
}
