#!/usr/bin/env node
// Checks the internal links in the agent skills under .mintlify/skills/.
//
// `mint broken-links` can't judge these files: Mintlify serves them as raw
// Markdown at /.well-known/agent-skills/<name>/skill.md, not as pages, so
// their cross-skill links look like missing pages, and their in-page anchors
// use GitHub's heading slugs (the form upstream stellar-dev-skill writes and
// the bundler generates), not Mintlify's. pnpm check:site-links skips this
// folder, and this script checks it the way the links are actually used:
//
//   #anchor                                     a heading in the same file
//   /.well-known/agent-skills/<name>/skill.md   a skill that exists
//   /.well-known/agent-skills/<name>/skill.md#a a heading in that skill
//
// External links are out of scope, the same as in mint broken-links.

import fs from "node:fs";
import path from "node:path";

const ROOT = ".mintlify/skills";
const WELL_KNOWN = /^\/\.well-known\/agent-skills\/([^/]+)\/skill\.md(?:#(.+))?$/;

const stripCode = (text) => text.replace(/```[\s\S]*?```/g, "");

// GitHub's heading anchor: link text only, lowercase, punctuation dropped,
// spaces to hyphens. Repeated headings get -1, -2, and so on.
const slug = (title) =>
  title
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}_\- ]/gu, "")
    .replace(/ /g, "-");

function headingSlugs(text) {
  const seen = new Map();
  const slugs = new Set();
  for (const [, title] of stripCode(text).matchAll(/^#{1,6} +(.+?) *#*$/gm)) {
    const s = slug(title);
    const n = seen.get(s) ?? 0;
    slugs.add(n ? `${s}-${n}` : s);
    seen.set(s, n + 1);
  }
  return slugs;
}

const skills = new Map();
for (const name of fs.readdirSync(ROOT)) {
  const file = path.join(ROOT, name, "SKILL.md");
  if (fs.existsSync(file)) {
    const text = fs.readFileSync(file, "utf8");
    skills.set(name, { file, text, slugs: headingSlugs(text) });
  }
}

const broken = [];
let checked = 0;
for (const [name, { file, text }] of skills) {
  for (const [, url] of stripCode(text).matchAll(/\]\(([^)\s]+)\)/g)) {
    let target, anchor;
    if (url.startsWith("#")) {
      [target, anchor] = [name, url.slice(1)];
    } else if (url.startsWith("/.well-known/")) {
      const m = url.match(WELL_KNOWN);
      if (!m) {
        broken.push([file, url, "not a /.well-known/agent-skills/<name>/skill.md link"]);
        continue;
      }
      [target, anchor] = [m[1], m[2]];
    } else {
      continue;
    }
    checked++;
    if (!skills.has(target)) broken.push([file, url, `no skill named "${target}"`]);
    else if (anchor && !skills.get(target).slugs.has(anchor))
      broken.push([file, url, `no heading in "${target}" has the anchor "${anchor}"`]);
  }
}

for (const [file, url, why] of broken) console.error(`${file}\n  ${url}: ${why}`);
console.log(`Checked ${checked} skill links in ${skills.size} skills: ${broken.length} broken.`);
process.exit(broken.length ? 1 : 0);
