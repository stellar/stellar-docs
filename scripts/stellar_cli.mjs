import fs from "fs";

const headers = { "user-agent": "https://github.com/stellar/stellar-docs" };
let result = await fetch("https://crates.io/api/v1/crates/stellar-cli", {
  headers,
});
const json = await result.json();
const version = json.crate.newest_version;

result = await fetch(
  // `https://github.com/stellar/stellar-cli/raw/v${version}/FULL_HELP_DOCS.md`,
  `https://github.com/stellar/stellar-cli/raw/main/FULL_HELP_DOCS.md`,
  { headers },
);
let text = await result.text();

text = `---
sidebar_position: 30
description: This document contains the help content for the stellar command-line program.
---

${text}
`;

fs.writeFileSync("docs/tools/developer-tools/cli/stellar-cli.mdx", text);

result = await fetch(
  `https://github.com/stellar/stellar-cli/raw/main/Cookbook.md`,
  { headers },
);
text = await result.text();

text = `---
sidebar_position: 40
description: This document contains the cookbook content for the stellar command-line program.
---

${text}
`;

fs.writeFileSync("docs/tools/stellar-cli-cookbook.mdx", text);