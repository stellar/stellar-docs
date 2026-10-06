// @ts-check
/**
 * Post-build step for the markdown-source feature (see rewrite_md_links.mjs).
 *
 * The docusaurus-markdown-source-plugin cleaner removes unknown paired MDX
 * components together with their inner content, so the `.md` twin of any
 * page using <CodeExample> loses its code blocks entirely.
 *
 * This script regenerates the twin of every routed source that uses
 * <CodeExample>: the wrapper tags are unwrapped first — preserving the
 * fenced code, and turning a `title` attribute into a bold label — and the
 * result is passed through the upstream plugin's own cleaner, so everything
 * else is processed identically to the plugin's output. The sibling wrappers
 * (<AttributeTable>, <ExampleResponse>, <MethodTable>) are unwrapped in the
 * same step, because a page that mixes them with <CodeExample> would otherwise
 * lose their content here.
 *
 * The twin-to-source mapping comes from build/.md-source-map.json, written
 * by src/plugins/markdown-source-map during the build (route metadata is
 * only available inside Docusaurus). rewrite_md_titles.mjs deletes the map
 * once it has run.
 *
 * MUST run before the other rewrite_md_* steps — the regenerated twins
 * still need the title, link, and admonition rewrites applied.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  cleanMarkdownForDisplay,
} = require('docusaurus-markdown-source-plugin/lib/clean-markdown');
const {
  transformOutsideCodeFences,
} = require('docusaurus-markdown-source-plugin/lib/fence-transform');

const SITE_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD_DIR = join(SITE_DIR, 'build');
const MAP_PATH = join(BUILD_DIR, '.md-source-map.json');

// A page that uses <CodeExample> may also wrap other content in one of the
// sibling components. Unwrapping only <CodeExample> would leave those for the
// cleaner to drop, which would undo the repair scripts/generate_api_markdown.mjs
// made earlier in `postbuild`, so every wrapper is unwrapped here.
const UNWRAP_COMPONENTS = ['CodeExample', 'AttributeTable', 'ExampleResponse', 'MethodTable'];
const UNWRAP_RE = new RegExp(
  `<(${UNWRAP_COMPONENTS.join('|')})\\b([^>]*)>([\\s\\S]*?)</\\1>`,
  'g',
);
const TITLE_ATTR_RE = /\btitle\s*=\s*["']([^"']*)["']/;
const MAX_UNWRAP_PASSES = 5; // enough for any nesting these pages actually use

function unwrapComponents(content) {
  // Unwrap outside code fences only, so documentation ABOUT the components
  // (a literal <CodeExample> inside a fence) is untouched.
  return transformOutsideCodeFences(content, (segment) => {
    // One pass unwraps siblings; nested wrappers need the pass to repeat,
    // because the outer match swallows the inner tags as body text.
    for (let pass = 0; pass < MAX_UNWRAP_PASSES; pass++) {
      const next = segment.replace(UNWRAP_RE, (_match, _name, attrs, inner) => {
        const title = attrs.match(TITLE_ATTR_RE);
        const body = inner.replace(/^\s*\n/, '').replace(/\s+$/, '');
        return title ? `**${title[1]}:**\n\n${body}` : body;
      });
      if (next === segment) break;
      segment = next;
    }
    return segment;
  });
}

function main() {
  if (!existsSync(MAP_PATH)) {
    console.warn(
      '[rewrite-md-code-examples] build/.md-source-map.json not found — skipping.',
    );
    return;
  }

  const entries = JSON.parse(readFileSync(MAP_PATH, 'utf8'));
  let touchedFiles = 0;

  for (const { routePath, sourceFilePath, twinRelPath } of entries) {
    let content;
    try {
      content = readFileSync(join(SITE_DIR, sourceFilePath), 'utf8');
    } catch {
      continue;
    }
    if (!/<CodeExample\b/.test(content)) continue;

    const routeDir = routePath.endsWith('/')
      ? routePath
      : routePath.replace(/[^/]+$/, '');
    writeFileSync(
      join(BUILD_DIR, twinRelPath),
      cleanMarkdownForDisplay(unwrapComponents(content), routeDir),
      'utf8',
    );
    touchedFiles++;
  }

  console.log(
    `[rewrite-md-code-examples] Regenerated ${touchedFiles} of ${entries.length} generated markdown file(s) with <CodeExample> content preserved.`,
  );
}

main();
