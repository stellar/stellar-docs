import fs from "fs-extra";
import https from "https";
import { fileURLToPath } from "url";

// In case there are plugins to exclude from the list, add them here.
// E.g. "user/repo"
const excludePlugins = ["haqnawaz03329-debug/haqnawaz"];

// The plugin list is built from GitHub repos that anyone can opt into by adding
// the `stellar-cli-plugin` topic, so every field below (name, description, URL)
// is attacker-controlled and ends up in an .mdx file. MDX renders Markdown,
// JSX and raw HTML, so unsanitized text allows stored XSS (e.g. a `<script>` in
// a repo description) as well as phishing links and tracking images via plain
// Markdown. We therefore treat all GitHub-provided text as untrusted.

// Render an untrusted string as literal text. Collapsing whitespace to a single
// line defeats block-level Markdown (headings, lists, blockquotes, code fences)
// and multi-line attribute tricks; backslash-escaping every ASCII punctuation
// character then neutralizes all inline Markdown, GFM autolinks, and JSX/HTML —
// CommonMark guarantees `\` + ASCII punctuation renders as the literal char, and
// MDX supports `\<` / `\{` escaping, so nothing is interpreted as markup.
function sanitizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[!-/:-@[-`{-~]/g, (c) => "\\" + c);
}

// Allow-list the only URL shape GitHub's API returns for these repos. Anything
// else (other hosts, or `javascript:` / `data:` schemes) is rejected so a
// malformed/hostile URL can never become a link target.
function safeUrl(value) {
  try {
    const url = new URL(String(value));
    if (url.protocol !== "https:") return null;
    if (url.hostname !== "github.com") return null;
    return url.href;
  } catch {
    return null;
  }
}

function exportMDX(data) {
  const pluginsContent = data.items.reduce((buffer, item) => {
    if (excludePlugins.includes(item.full_name)) {
      return buffer;
    }

    const url = safeUrl(item.html_url);
    if (!url) {
      return buffer;
    }

    const plugin = `### [${sanitizeText(item.full_name)}](${url})

${sanitizeText(item.description)}

[${url}](${url})
`;

    return buffer + plugin;
  }, "");

  const modifiedContent = `---
title: Plugins List
description: See a list of published Stellar CLI plugin
sidebar_position: 30
---

This is a list of all plugins made available by the community, so please review with care before using them.

${pluginsContent}
`;

  fs.writeFileSync("docs/tools/cli/plugins-list.mdx", modifiedContent);

  console.log("Plugin list generated successfully.");
}

function main() {
  const endpoint =
    "https://api.github.com/search/repositories?q=topic%3Astellar-cli-plugin+fork%3Afalse+archived%3Afalse&per_page=100&sort=stars&order=desc";

  https
    .get(
      endpoint,
      { headers: { "user-agent": "https://github.com/stellar/stellar-docs" } },
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          exportMDX(JSON.parse(data));
        });
      },
    )
    .on("error", (err) => {
      console.error("Error fetching plugin list:", err.message);
    });
}

// Only fetch/generate when run directly (`node scripts/stellar_cli_plugins.mjs`),
// so the helpers above can be imported by tests without a network call.
if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export { sanitizeText, safeUrl, exportMDX, excludePlugins };
