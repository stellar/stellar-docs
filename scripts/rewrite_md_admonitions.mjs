// @ts-check
/**
 * Post-build step for the markdown-source feature (see rewrite_md_links.mjs).
 *
 * The docusaurus-markdown-source-plugin emits a `.md` twin of every docs page
 * but passes Docusaurus admonitions (`:::info[Title]` ... `:::`) through
 * verbatim. That syntax is not standard Markdown, so markdown previews render
 * the `:::` lines literally.
 *
 * This script rewrites admonitions INSIDE the generated `build/**\/*.md` files
 * to GitHub-style alerts (https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts):
 *
 *     :::info[Title]          > [!NOTE]
 *     Body.           --->    > **Title**
 *     :::                     > Body.
 *
 * which render as colored callouts on GitHub and in common markdown viewers,
 * and degrade to plain blockquotes elsewhere. Docusaurus admonition types map
 * to the closest of GitHub's five alert types. Nested admonitions become
 * nested quotes; admonitions indented inside list items keep their indent.
 * Lines inside code fences are left untouched so documented admonition syntax
 * survives.
 *
 * It does NOT touch any source file in the repo and does NOT affect the HTML
 * site — it only post-processes generated build artifacts. It is idempotent:
 * a converted file contains no admonition lines for a re-run to match.
 *
 * Runs automatically via the `postbuild` npm lifecycle hook, so it applies in
 * CI and the production Docker build alike.
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const BUILD_DIR = 'build';

const FENCE_RE = /^\s*(```|~~~)/;
// ":::type" or ":::type[Title]" (3+ colons for nesting, optional indentation).
const OPEN_RE = /^([ \t]*):{3,}([a-zA-Z]+)(?:\[(.*)\])?[ \t]*$/;
// Bare ":::" closing line (3+ colons, optional indentation).
const CLOSE_RE = /^[ \t]*:{3,}[ \t]*$/;

// Docusaurus admonition type -> closest GitHub alert type.
const ALERT_TYPE = {
  note: 'NOTE',
  info: 'NOTE',
  tip: 'TIP',
  important: 'IMPORTANT',
  warning: 'WARNING',
  caution: 'CAUTION',
  danger: 'CAUTION',
};

/** Convert admonition blocks to GitHub alerts; returns null when unchanged. */
function convertAdmonitions(content) {
  let changed = 0;
  let inFence = false;
  /** @type {{ indent: string }[]} */
  const stack = [];
  const out = [];

  const prefix = () => (stack[0]?.indent ?? '') + '> '.repeat(stack.length);

  for (const line of content.split('\n')) {
    if (FENCE_RE.test(line)) inFence = !inFence;

    if (!inFence) {
      const open = line.match(OPEN_RE);
      if (open) {
        const [, indent, type, title] = open;
        stack.push({ indent });
        out.push(`${prefix()}[!${ALERT_TYPE[type.toLowerCase()] ?? 'NOTE'}]`);
        if (title) out.push(`${prefix()}**${title}**`);
        changed++;
        continue;
      }
      if (stack.length > 0 && CLOSE_RE.test(line)) {
        stack.pop();
        changed++;
        continue; // drop the closing line entirely
      }
    }

    if (stack.length > 0) {
      // Blockquote the admonition body (fenced lines included — fences are
      // valid inside blockquotes). Strip the opener's indent so the body
      // aligns under the quote marker; blank lines become bare ">".
      const { indent } = stack[stack.length - 1];
      const rest = line.startsWith(indent)
        ? line.slice(indent.length)
        : line.trimStart();
      out.push(rest === '' ? prefix().trimEnd() : prefix() + rest);
      continue;
    }

    out.push(line);
  }

  return changed > 0 ? out.join('\n') : null;
}

/** Recursively collect every *.md file under dir. */
function collectMd(dir) {
  return readdirSync(dir, { recursive: true })
    .map((p) => join(dir, String(p)))
    .filter((p) => p.endsWith('.md'));
}

function main() {
  if (!existsSync(BUILD_DIR)) {
    console.warn(`[rewrite-md-admonitions] "${BUILD_DIR}/" not found — skipping.`);
    return;
  }

  const files = collectMd(BUILD_DIR);
  let touchedFiles = 0;

  for (const file of files) {
    const out = convertAdmonitions(readFileSync(file, 'utf8'));
    if (out !== null) {
      writeFileSync(file, out);
      touchedFiles++;
    }
  }

  console.log(
    `[rewrite-md-admonitions] Converted admonitions in ${touchedFiles} of ${files.length} generated markdown file(s).`,
  );
}

main();
