import fs from "fs-extra";
import https from "https";

// In case there are plugins to exclude from the list, add them here.
// E.g. "user/repo"
const excludePlugins = [];

function exportMDX(data) {
  const pluginsContent = data.items.reduce((buffer, item) => {
    if (excludePlugins.includes(item.full_name)) {
      return buffer;
    }

    const plugin = `### [${item.full_name}](${item.html_url})

${item.description || ""}

[${item.html_url}](${item.html_url})
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
