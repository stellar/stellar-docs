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

// copy mdx files from the CLI to the guides section
const sourcePath = 'docs';
const targetDir = 'docs/build/guides/cli/';

// Ensure the target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function fetchAndSaveFile(filename) {
  const result = await fetch(`https://raw.githubusercontent.com/stellar/stellar-cli/main/${filename}`, { headers });
  const text = await result.text();

  const targetPath = path.join(targetDir, path.basename(filename));
  fs.writeFileSync(targetPath, text);
  console.log(`Saved ${filename}`);
}

async function getFileList() {
  const response = await fetch(`https://api.github.com/repos/stellar/stellar-cli/git/trees/main?recursive=1`, { headers });
  const data = await response.json();

  if (!data.tree) {
    throw new Error('Unable to retrieve file list from GitHub API');
  }

  return data.tree
    .filter(item => item.type === 'blob' && item.path.startsWith(sourcePath) && path.extname(item.path) === '.mdx')
    .map(item => item.path);
}

async function processFiles() {
  try {
    const mdxFiles = await getFileList();

    for (const file of mdxFiles) {
      await fetchAndSaveFile(file);
    }

    console.log('All files processed successfully.');
  } catch (error) {
    console.error('Error processing files:', error);
  }
}

processFiles();