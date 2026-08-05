import { test } from "node:test";
import assert from "node:assert/strict";

import { sanitizeText, safeUrl } from "./stellar_cli_plugins.mjs";

// After sanitizeText, every Markdown/JSX/HTML-significant character must be
// backslash-escaped. Strip all `\<punctuation>` escape pairs and assert that no
// active special character is left unescaped — this is the property that makes
// the output render as literal text.
function assertFullyNeutralized(out) {
  const stripped = out.replace(/\\[!-/:-@[-`{-~]/g, "");
  const leftover = stripped.match(/[!-/:-@[-`{-~]/g);
  assert.equal(
    leftover,
    null,
    `unescaped special characters survived: ${JSON.stringify(leftover)} in ${JSON.stringify(out)}`,
  );
}

test("sanitizeText neutralizes <script> injection", () => {
  const out = sanitizeText("Cool plugin! <script>alert('Website Hacked')</script>");
  assertFullyNeutralized(out);
  assert.ok(!/(^|[^\\])</.test(out), "no unescaped '<' remains");
});

test("sanitizeText neutralizes JSX expression braces", () => {
  const out = sanitizeText("danger {process.env.SECRET} here");
  assertFullyNeutralized(out);
  assert.ok(!/(^|[^\\])[{}]/.test(out), "no unescaped brace remains");
});

test("sanitizeText neutralizes Markdown links (phishing)", () => {
  const out = sanitizeText("[Official — install now](https://evil.example.com)");
  assert.ok(!out.includes("]("), "link syntax must be broken");
  assertFullyNeutralized(out);
});

test("sanitizeText neutralizes Markdown images (tracking pixels)", () => {
  const out = sanitizeText("![pixel](https://evil.example.com/p.png)");
  assert.ok(!out.includes("!["), "image syntax must be broken");
  assertFullyNeutralized(out);
});

test("sanitizeText neutralizes GFM autolinks", () => {
  const out = sanitizeText("visit http://evil.example.com now");
  assert.ok(!out.includes("http://"), "bare URL scheme must be broken");
  assertFullyNeutralized(out);
});

test("sanitizeText collapses newlines so block constructs cannot start", () => {
  const out = sanitizeText("line one\n\n### Fake heading\n> quote");
  assert.ok(!out.includes("\n"), "must be a single line");
  assertFullyNeutralized(out);
});

test("sanitizeText leaves plain prose untouched but escapes punctuation", () => {
  // Plain words render unchanged; only punctuation gains a backslash, which the
  // Markdown renderer consumes, so the visible output matches the original text.
  assert.equal(sanitizeText("hello world"), "hello world");
  assert.equal(sanitizeText("a & b"), "a \\& b");
  assert.equal(sanitizeText("emphasis _here_ and *there*"), "emphasis \\_here\\_ and \\*there\\*");
});

test("sanitizeText handles null/undefined", () => {
  assert.equal(sanitizeText(null), "");
  assert.equal(sanitizeText(undefined), "");
});

test("safeUrl accepts canonical GitHub repo URLs", () => {
  assert.equal(
    safeUrl("https://github.com/stellar/stellar-docs"),
    "https://github.com/stellar/stellar-docs",
  );
});

test("safeUrl rejects javascript: scheme", () => {
  assert.equal(safeUrl("javascript:alert(1)"), null);
});

test("safeUrl rejects data: scheme", () => {
  assert.equal(safeUrl("data:text/html,<script>alert(1)</script>"), null);
});

test("safeUrl rejects non-https schemes", () => {
  assert.equal(safeUrl("http://github.com/a/b"), null);
});

test("safeUrl rejects look-alike and other hosts", () => {
  assert.equal(safeUrl("https://github.com.evil.com/a/b"), null);
  assert.equal(safeUrl("https://evil.com/a/b"), null);
});

test("safeUrl rejects malformed input", () => {
  assert.equal(safeUrl("not a url"), null);
  assert.equal(safeUrl(null), null);
});
