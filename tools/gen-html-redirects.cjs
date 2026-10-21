#!/usr/bin/env node
/*
 * gen-html-redirects.cjs
 * ---------------------------------------------------------------------------
 * Generates a redirect map that strips a trailing `.html` from every page URL
 * (e.g. /docs/learn/glossary.html -> /docs/learn/glossary), merges it with any
 * redirects already defined in docs.json, and writes the combined list to a
 * standalone `redirects.json`. It then rewrites docs.json's `redirects` key to
 * a single `{ "$ref": "redirects.json" }` so the large list lives outside
 * docs.json. Mintlify's prebuild resolves the $ref at build time.
 *
 * Re-runnable: it reads the current page list from docs.json's navigation each
 * time, so adding/removing pages + re-running keeps the map in sync. Existing
 * redirects (by source) always win over generated ones.
 *
 * Usage:
 *   node tools/gen-html-redirects.cjs          # apply (writes redirects.json + docs.json)
 *   node tools/gen-html-redirects.cjs --dry     # print summary only, write nothing
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DOCS_JSON = path.join(ROOT, 'docs.json');
const REDIRECTS_JSON = path.join(ROOT, 'redirects.json');
const REF_VALUE = 'redirects.json';
const DRY = process.argv.includes('--dry');

const text = fs.readFileSync(DOCS_JSON, 'utf8');
const cfg = JSON.parse(text);

// --- 1. Collect page routes: string items of any "pages" array + any "root".
const routes = new Set();
(function walk(node) {
  if (Array.isArray(node)) return node.forEach(walk);
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === 'pages' && Array.isArray(v)) {
        for (const item of v) {
          if (typeof item === 'string') routes.add(item);
          else walk(item);
        }
      } else if (k === 'root' && typeof v === 'string') {
        routes.add(v);
      } else {
        walk(v);
      }
    }
  }
})(cfg.navigation || cfg);

// --- 2. Preserve existing redirects (resolve a pre-existing $ref if present).
let existing = [];
if (Array.isArray(cfg.redirects)) {
  existing = cfg.redirects;
} else if (cfg.redirects && typeof cfg.redirects === 'object' && cfg.redirects.$ref) {
  const refPath = path.join(ROOT, cfg.redirects.$ref);
  if (fs.existsSync(refPath)) existing = JSON.parse(fs.readFileSync(refPath, 'utf8'));
}

const existingSources = new Set(existing.map((r) => r.source));

// --- 3. Build .html -> clean-slug redirects, skipping any source already taken.
const generated = [];
for (const route of [...routes].sort()) {
  const clean = '/' + route.replace(/^\/+/, '');
  const source = clean + '.html';
  if (existingSources.has(source)) continue;
  generated.push({ source, destination: clean }); // permanent defaults to true (308)
}

const combined = [...existing, ...generated];

// Sanity: sources must be unique (Mintlify enforces this).
const seen = new Set();
const dupes = [];
for (const r of combined) {
  if (seen.has(r.source)) dupes.push(r.source);
  seen.add(r.source);
}

console.log(`page routes:        ${routes.size}`);
console.log(`existing redirects: ${existing.length}`);
console.log(`generated (.html):  ${generated.length}`);
console.log(`combined total:     ${combined.length}`);
console.log(`duplicate sources:  ${dupes.length}${dupes.length ? ' -> ' + dupes.slice(0, 5).join(', ') : ''}`);
if (dupes.length) {
  console.error('Refusing to write: duplicate sources would fail validation.');
  process.exit(1);
}

if (DRY) {
  console.log('\n--dry: no files written. Sample generated entries:');
  generated.slice(0, 5).forEach((r) => console.log('  ', JSON.stringify(r)));
  process.exit(0);
}

// --- 4. Write redirects.json.
fs.writeFileSync(REDIRECTS_JSON, JSON.stringify(combined, null, 2) + '\n');

// --- 5. Surgically replace docs.json's `redirects` value with a $ref, leaving
// the rest of the file byte-for-byte unchanged.
const keyIdx = text.lastIndexOf('"redirects"');
if (keyIdx === -1) {
  console.error('Could not find "redirects" key in docs.json.');
  process.exit(1);
}
// Find the start of the value after the colon.
let i = text.indexOf(':', keyIdx) + 1;
while (/\s/.test(text[i])) i++;
const open = text[i]; // '[' for an array or '{' for an existing $ref object
if (open !== '[' && open !== '{') {
  console.error(`Unexpected redirects value start: ${JSON.stringify(open)}`);
  process.exit(1);
}
const close = open === '[' ? ']' : '}';

// String-aware bracket matcher.
let depth = 0;
let end = -1;
let inStr = false;
let esc = false;
for (let j = i; j < text.length; j++) {
  const c = text[j];
  if (inStr) {
    if (esc) esc = false;
    else if (c === '\\') esc = true;
    else if (c === '"') inStr = false;
    continue;
  }
  if (c === '"') inStr = true;
  else if (c === open) depth++;
  else if (c === close) {
    depth--;
    if (depth === 0) { end = j; break; }
  }
}
if (end === -1) {
  console.error('Could not find end of redirects value.');
  process.exit(1);
}

const newText = text.slice(0, i) + `{ "$ref": "${REF_VALUE}" }` + text.slice(end + 1);

// Validate the result parses and the $ref is in place.
const reparsed = JSON.parse(newText);
if (!reparsed.redirects || reparsed.redirects.$ref !== REF_VALUE) {
  console.error('Post-edit validation failed: redirects is not a $ref.');
  process.exit(1);
}
fs.writeFileSync(DOCS_JSON, newText);

console.log(`\nWrote ${REDIRECTS_JSON} (${combined.length} entries).`);
console.log('Rewrote docs.json "redirects" -> { "$ref": "redirects.json" }.');
