import fs from "fs-extra";
import https from "https";

// In case there are plugins to exclude from the list, add them here.
// E.g. "user/repo"
const excludePlugins = ["haqnawaz03329-debug/haqnawaz"];

const MD_ENTITIES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "*": "&#42;",
  _: "&#95;",
  "`": "&#96;",
  "[": "&#91;",
  "]": "&#93;",
  "(": "&#40;",
  ")": "&#41;",
  "#": "&#35;",
  "+": "&#43;",
  "-": "&#45;",
  ".": "&#46;",
  "!": "&#33;",
  "|": "&#124;",
  "~": "&#126;",
  "\\": "&#92;",
  "{": "&#123;",
  "}": "&#125;",
  "=": "&#61;",
  ":": "&#58;",
  $: "&#36;",
};

function escape(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[&<>"'*_`\[\]()#+\-.!|~\\{}=:$]/g, (ch) => MD_ENTITIES[ch]);
}

function exportMDX(data) {
  const pluginsContent = data.items.reduce((buffer, item) => {
    if (excludePlugins.includes(item.full_name)) {
      return buffer;
    }

    const plugin = `### [${escape(item.full_name)}](${encodeURI(item.html_url)})

<p>${escape(item.description)}</p>

[${encodeURI(item.html_url)}](${encodeURI(item.html_url)})
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
