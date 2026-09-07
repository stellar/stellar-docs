// @ts-check
/**
 * Post-build step for the markdown-source feature (see rewrite_md_links.mjs).
 *
 * The docusaurus-markdown-source-plugin strips YAML front matter from the
 * generated `.md` twins but never re-injects the page title, so every twin
 * starts abruptly with the first body paragraph while its HTML counterpart
 * shows the title as an H1.
 *
 * This script prepends `# {front matter title}` to each twin, using the
 * twin-to-source map written by src/plugins/markdown-source-map. Pages
 * without a front matter `title`, with `hide_title: true`, or whose body
 * already starts with an H1 are left alone. The map file is deleted
 * afterwards (this is the last step that consumes it) so it is not deployed.
 *
 * MUST run after rewrite_md_code_examples.mjs (which regenerates some twins
 * from source, discarding earlier edits) and before rewrite_md_links.mjs /
 * rewrite_md_admonitions.mjs is fine either way — the injected line is plain
 * markdown that neither step touches.
 */

import {
  readFileSync,
  writeFileSync,
  unlinkSync,
  existsSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD_DIR = join(SITE_DIR, 'build');
const MAP_PATH = join(BUILD_DIR, '.md-source-map.json');

/** Extract the `title` from a source file's YAML front matter, if any. */
function frontMatterTitle(source) {
  const fm = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!fm) return null;
  if (/^hide_title:\s*true\b/m.test(fm[1])) return null;
  const title = fm[1].match(/^title:[ \t]*(.+?)[ \t]*$/m);
  if (!title) return null;
  // Strip surrounding quotes if present.
  return title[1].replace(/^(["'])(.*)\1$/, '$2');
}

function main() {
  if (!existsSync(MAP_PATH)) {
    console.warn(
      '[rewrite-md-titles] build/.md-source-map.json not found — skipping.',
    );
    return;
  }

  const entries = JSON.parse(readFileSync(MAP_PATH, 'utf8'));
  let touchedFiles = 0;

  for (const { sourceFilePath, twinRelPath } of entries) {
    let source;
    try {
      source = readFileSync(join(SITE_DIR, sourceFilePath), 'utf8');
    } catch {
      continue;
    }
    const title = frontMatterTitle(source);
    if (!title) continue;

    const twinPath = join(BUILD_DIR, twinRelPath);
    let twin;
    try {
      twin = readFileSync(twinPath, 'utf8');
    } catch {
      continue;
    }
    if (twin.startsWith('# ')) continue;

    writeFileSync(twinPath, `# ${title}\n\n${twin}`, 'utf8');
    touchedFiles++;
  }

  unlinkSync(MAP_PATH);
  console.log(
    `[rewrite-md-titles] Injected the page title into ${touchedFiles} of ${entries.length} generated markdown file(s).`,
  );
}

main();
