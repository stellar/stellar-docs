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
 * to the closest of GitHub's five alert types. A synthesized title gets an
 * empty quote line after it so it doesn't lazily merge into the first body
 * paragraph. GitHub only renders alerts at the top level, so nested
 * admonitions and ones indented inside list items become plain blockquotes
 * with a bold "Type: Title" label instead of a literal "[!TYPE]" marker.
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

// Code-fence delimiter: 3+ backticks or tildes, optionally indented.
const FENCE_OPEN_RE = /^\s*(`{3,}|~{3,})/;
// A closing fence is the delimiter alone — no info string after it.
const FENCE_CLOSE_RE = /^\s*(`{3,}|~{3,})[ \t]*$/;
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

// Emoji stand-ins for the admonition icons, used where GitHub alert syntax
// doesn't render (nested / list-indented admonitions).
const TYPE_EMOJI = {
  note: 'ℹ️',
  info: 'ℹ️',
  tip: '💡',
  important: '❗',
  warning: '⚠️',
  caution: '⚠️',
  danger: '🔥',
};

/** Convert admonition blocks to GitHub alerts; returns null when unchanged. */
function convertAdmonitions(content) {
  let changed = 0;
  /** Delimiter of the code fence we're inside (e.g. "````"), or null. */
  let fence = null;
  /** Separate a synthesized title from the next body line with an empty
   * quote line, so the two don't lazily merge into one paragraph. */
  let needBlank = false;
  /** @type {{ indent: string }[]} */
  const stack = [];
  const out = [];

  const prefix = () => (stack[0]?.indent ?? '') + '> '.repeat(stack.length);

  for (const line of content.split('\n')) {
    if (fence) {
      // Per CommonMark, only a bare delimiter of the same character and at
      // least the opening length closes the fence; anything else (an inner
      // fence of the other character, a shorter run, or a line with an info
      // string) is fenced content.
      const close = line.match(FENCE_CLOSE_RE);
      if (close && close[1][0] === fence[0] && close[1].length >= fence.length) {
        fence = null;
      }
    } else {
      const open = line.match(FENCE_OPEN_RE);
      if (open) fence = open[1];
    }

    if (!fence) {
      const open = line.match(OPEN_RE);
      if (open) {
        const [, indent, type, title] = open;
        const alert = ALERT_TYPE[type.toLowerCase()] ?? 'NOTE';
        const topLevel = stack.length === 0 && indent === '';
        if (needBlank) {
          out.push(prefix().trimEnd());
          needBlank = false;
        }
        stack.push({ indent });
        if (topLevel) {
          out.push(`${prefix()}[!${alert}]`);
          if (title) {
            out.push(`${prefix()}**${title}**`);
            needBlank = true;
          }
        } else {
          // GitHub only renders alerts at the top level; a nested or
          // list-indented "[!TYPE]" shows up as literal text, so degrade to
          // a blockquote led by the type's emoji icon and a bold label. The
          // label keeps the original Docusaurus type name (e.g. "Danger"),
          // matching the HTML page, since this path isn't limited to
          // GitHub's alert set.
          const t = type.toLowerCase();
          const label = t[0].toUpperCase() + t.slice(1);
          const emoji = TYPE_EMOJI[t] ?? 'ℹ️';
          out.push(
            `${prefix()}${emoji} **${title ? `${label}: ${title}` : label}**`,
          );
          needBlank = true;
        }
        changed++;
        continue;
      }
      if (stack.length > 0 && CLOSE_RE.test(line)) {
        stack.pop();
        needBlank = false;
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
      if (rest === '') {
        out.push(prefix().trimEnd());
      } else {
        if (needBlank) out.push(prefix().trimEnd());
        out.push(prefix() + rest);
      }
      needBlank = false;
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
