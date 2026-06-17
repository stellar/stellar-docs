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
 * This script rewrites intra-doc links INSIDE the generated `build/**\/*.md`
 * files to the FULL canonical URL of the served `.md` twin
 * (e.g. `https://developers.stellar.org/docs/networks.md`) — self-contained, so
 * an agent can fetch a linked page directly without resolving relative paths,
 * and consistent with how `static/llms.txt` already references pages. The site
 * origin + baseUrl are read from docusaurus.config.ts (single source of truth).
 *
 * It does NOT touch any source file in the repo and does NOT affect the HTML
 * site — it only post-processes generated build artifacts. (Verified: re-running
 * it leaves every build/**\/*.html byte-identical, and full-URL links are skipped
 * as external on re-runs, so it is idempotent.)
 *
 * Correctness:
 *  - Every candidate link is resolved against the actual generated build tree; a
 *    link is rewritten only when the target `.md` genuinely exists, so we never
 *    point at a missing page. Mapping mirrors the plugin's output naming:
 *      `foo.mdx` -> `foo.md`,  `foo/README.mdx` -> `foo.md`,  `foo/README.md` -> `foo.md`.
 *  - Section-index twins: the plugin collapses `dir/README.mdx` to `dir.md`,
 *    lifting it one directory up, which desyncs links authored relative to
 *    `dir/`. For any twin that has a sibling directory of the same name we pick
 *    the resolution base (the twin's own dir vs. that sibling dir) that resolves
 *    the MOST links to real twins — a per-file vote needing no assumption about
 *    README vs. category-page conventions.
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
const BUILD_ROOT = resolve(BUILD_DIR);

// [text](target) and ![alt](target) — capture the bare target (no spaces/titles).
const LINK_RE = /(!?\[[^\]]*\]\()([^)\s]+)(\))/g;

/** Read the canonical site origin + baseUrl from docusaurus.config.ts. */
function readSiteConfig() {
  const fallback = { origin: 'https://developers.stellar.org', baseUrl: '/' };
  try {
    const cfg = readFileSync('docusaurus.config.ts', 'utf8');
    const url = cfg.match(/\burl:\s*["']([^"']+)["']/)?.[1];
    const baseUrl = cfg.match(/\bbaseUrl:\s*["']([^"']+)["']/)?.[1] ?? '/';
    if (!url) return fallback;
    return { origin: url.replace(/\/+$/, ''), baseUrl };
  } catch {
    return fallback;
  }
}

const SITE = readSiteConfig();

/** Canonical full URL for a twin file, derived from its path under build/. */
function twinUrl(twinAbs) {
  const rel = relative(BUILD_ROOT, twinAbs); // e.g. "docs/networks.md"
  const base = SITE.baseUrl.endsWith('/') ? SITE.baseUrl : SITE.baseUrl + '/';
  const path = (base + rel).replace(/\/{2,}/g, '/'); // "/docs/networks.md"
  return SITE.origin + (path.startsWith('/') ? path : '/' + path);
}

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

function rewriteContent(content, resolveBaseAbs) {
  let changed = 0;
  const out = content.replace(LINK_RE, (full, open, target, close) => {
    const r = resolveLink(target, resolveBaseAbs);
    if (!r) return full;
    const next = twinUrl(r.twin) + r.suffix;
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

    const { out, changed } = rewriteContent(content, resolveBaseAbs);
    if (changed > 0) {
      writeFileSync(file, out);
      touchedFiles++;
      touchedLinks += changed;
    }
  }

  console.log(
    `[rewrite-md-links] Rewrote ${touchedLinks} link(s) to ${SITE.origin} across ${touchedFiles} of ${files.length} generated markdown file(s).`,
  );
}

main();
