#!/usr/bin/env node
// Keeps block-level MDX components separated by blank lines: after an opening
// tag, before a closing tag, and around the component itself. Without them,
// a closing tag right after a list item (or before `---`) is parsed as part of
// that list item (or as a setext heading), and the MDX build fails.
//
// A component tag is a line holding only `<Name ...>` or `</Name>` (Name
// capitalized, not self-closing). Code fences are left alone.
//
// Usage: node scripts/pad-component-tags.mjs [--check] FILE...
// With --check, prints the files that need padding and exits 1 instead of writing.
import fs from "node:fs";

const OPEN = /^\s*<([A-Z][\w.]*)(\s[^<>]*)?>\s*$/;
const CLOSE = /^\s*<\/([A-Z][\w.]*)>\s*$/;
const FENCE = /^\s*(```|~~~)/;

const isOpen = (line) => OPEN.test(line) && !line.trimEnd().endsWith("/>");
const isClose = (line) => CLOSE.test(line);
const isTag = (line) => isOpen(line) || isClose(line);

function pad(text) {
  const lines = text.split("\n");
  const out = [];
  let fence = null;
  lines.forEach((line, i) => {
    const m = line.match(FENCE);
    if (fence) {
      out.push(line);
      if (m && m[1] === fence) fence = null;
      return;
    }
    if (m) {
      fence = m[1];
      out.push(line);
      return;
    }
    const tag = isTag(line);
    const prev = out.length ? out[out.length - 1] : "";
    const next = i + 1 < lines.length ? lines[i + 1] : "";
    if (tag && prev.trim() !== "" && !isTag(prev)) out.push("");
    out.push(line);
    if (tag && next.trim() !== "" && !isTag(next)) out.push("");
  });
  return out.join("\n");
}

const args = process.argv.slice(2);
const check = args.includes("--check");
const changed = [];
for (const file of args.filter((a) => a !== "--check")) {
  const src = fs.readFileSync(file, "utf8");
  const padded = pad(src);
  if (padded !== src) {
    changed.push(file);
    if (!check) fs.writeFileSync(file, padded);
  }
}
for (const file of changed) console.log(`${check ? "needs padding" : "padded"}: ${file}`);
process.exit(check && changed.length ? 1 : 0);
