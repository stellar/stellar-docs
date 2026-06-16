// @ts-check
/**
 * Post-build step for the markdown-source feature (PR #2249 / #2289).
 *
 * The docusaurus-markdown-source-plugin emits a `.md` twin of every docs page
 * (e.g. `/docs/learn/fundamentals/stellar-stack.md`) for LLM/agent consumers,
 * but it does NOT rewrite intra-doc links: relative links keep their source
 * `.mdx`/`.md` paths. Requesting those `.mdx` URLs 404s (only the `.md` twin is
 * served), so an agent that follows links falls out of "markdown mode".
 *
 * This script rewrites relative markdown links INSIDE the generated
 * `build/**\/*.md` files so they point at the served `.md` twin. It does NOT
 * touch any source file in the repo and does NOT affect the HTML site — it only
 * post-processes generated build artifacts. (Verified: re-running it leaves every
 * build/**\/*.html byte-identical.)
 *
 * Correctness:
 *  - Every candidate link is resolved against the actual generated build tree; a
 *    link is rewritten only when the target `.md` genuinely exists, so we never
 *    introduce a broken link.
 *  - Mapping mirrors the plugin's output naming:
 *      `foo.mdx` -> `foo.md`,  `foo/README.mdx` -> `foo.md`,  `foo/README.md` -> `foo.md`.
 *  - Section-index twins are tricky: the plugin collapses `dir/README.mdx` to
 *    `dir.md`, lifting it one directory up, which desyncs links authored relative
 *    to `dir/`. For any twin that has a sibling directory of the same name we
 *    therefore pick the resolution base (the twin's own dir vs. that sibling dir)
 *    that resolves the MOST links to real twins — a per-file vote that needs no
 *    assumption about README vs. category-page conventions. Output paths are
 *    always computed relative to the twin file's own location, so the rewritten
 *    link resolves correctly from the served `.md` URL.
 *
 * Plain non-README `.md` links already resolve and are left untouched. Anchors
 * (`#section`) and queries (`?x=y`) are preserved; external, absolute-root and
 * anchor-only links are skipped.
 *
 * Runs automatically via the `postbuild` npm lifecycle hook (pnpm runs post
 * scripts by default), so it applies in CI and the production Docker build alike.
 */

import {
  readdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  statSync,
} from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';

const BUILD_DIR = 'build';

// [text](target) and ![alt](target) — capture the bare target (no spaces/titles).
const LINK_RE = /(!?\[[^\]]*\]\()([^)\s]+)(\))/g;

/**
 * Map an absolute source-link path to its served `.md` twin (absolute), or null
 * if this kind of path isn't something we rewrite.
 */
function servedTwin(absSourcePath) {
  if (/(^|\/)README\.mdx?$/i.test(absSourcePath)) {
    // dir/README.(md|mdx) -> dir.md  (sibling named after the directory)
    return dirname(absSourcePath) + '.md';
  }
  if (absSourcePath.endsWith('.mdx')) {
    return absSourcePath.slice(0, -'.mdx'.length) + '.md';
  }
  return null; // plain non-README .md already resolves; leave it alone
}

/**
 * Resolve a link target against a base dir to its existing twin file.
 * Returns { suffix, twin } when the target is a rewritable doc link whose twin
 * exists on disk; otherwise null.
 */
function resolveLink(target, baseDirAbs) {
  // Skip external, absolute-root, protocol-relative and anchor-only links.
  if (/^(https?:|mailto:|tel:|\/\/|\/|#)/i.test(target)) return null;

  const m = target.match(/^([^#?]*)([#?].*)?$/);
  if (!m || !m[1]) return null;
  const linkPath = m[1];
  const suffix = m[2] ?? '';

  // Only doc-source links: any .mdx, or a README.md (which the plugin collapses).
  const isReadme = /(^|\/)README\.mdx?$/i.test(linkPath);
  if (!linkPath.endsWith('.mdx') && !isReadme) return null;

  const twin = servedTwin(resolve(baseDirAbs, linkPath));
  if (!twin || !existsSync(twin)) return null;
  return { suffix, twin };
}

/** How many of a file's links resolve to real twins under a given base dir. */
function countResolvable(content, baseDirAbs) {
  let n = 0;
  for (const match of content.matchAll(LINK_RE)) {
    if (resolveLink(match[2], baseDirAbs)) n++;
  }
  return n;
}

function rewriteContent(content, resolveBaseAbs, linkFromDirAbs) {
  let changed = 0;
  const out = content.replace(LINK_RE, (full, open, target, close) => {
    const r = resolveLink(target, resolveBaseAbs);
    if (!r) return full;
    let rel = relative(linkFromDirAbs, r.twin);
    if (!rel.startsWith('.')) rel = './' + rel;
    const next = rel + r.suffix;
    if (next === target) return full;
    changed++;
    return open + next + close;
  });
  return { out, changed };
}

/** Recursively collect every *.md file under dir. */
function collectMd(dir) {
  return readdirSync(dir, { recursive: true })
    .map((p) => join(dir, String(p)))
    .filter((p) => p.endsWith('.md'));
}

function main() {
  if (!existsSync(BUILD_DIR)) {
    console.warn(`[rewrite-md-links] "${BUILD_DIR}/" not found — skipping.`);
    return;
  }

  const files = collectMd(BUILD_DIR);
  let touchedFiles = 0;
  let touchedLinks = 0;

  for (const file of files) {
    const fileDirAbs = resolve(dirname(file)); // where the twin actually lives
    const content = readFileSync(file, 'utf8');

    // Default: resolve links relative to the twin's own directory.
    let resolveBaseAbs = fileDirAbs;

    // Section-index twin? (a sibling directory shares this file's basename) Then
    // its source lived one level deeper; vote on which base resolves more links.
    const siblingDir = resolve(file.slice(0, -'.md'.length));
    if (existsSync(siblingDir) && statSync(siblingDir).isDirectory()) {
      if (countResolvable(content, siblingDir) > countResolvable(content, fileDirAbs)) {
        resolveBaseAbs = siblingDir;
      }
    }

    const { out, changed } = rewriteContent(content, resolveBaseAbs, fileDirAbs);
    if (changed > 0) {
      writeFileSync(file, out);
      touchedFiles++;
      touchedLinks += changed;
    }
  }

  console.log(
    `[rewrite-md-links] Rewrote ${touchedLinks} link(s) across ${touchedFiles} of ${files.length} generated markdown file(s).`,
  );
}

main();
