import fs from "fs-extra";
import path from 'path';
import { execSync } from 'child_process';

const repoUrl = 'https://github.com/stellar/stellar-cli.git';
const localRepoPath = './stellar-cli-repo';

// Remove the existing repo if it exists
if (fs.existsSync(localRepoPath)) {
  console.log('Removing existing repository...');
  fs.removeSync(localRepoPath);
}

// Perform a shallow clone of the repository
console.log('Cloning repository...');
execSync(`git clone --depth 1 ${repoUrl} ${localRepoPath}`);

// Copy FULL_HELP_DOCS.md
const fullHelpDocsPath = path.join(localRepoPath, 'FULL_HELP_DOCS.md');
const fullHelpDocsContent = fs.readFileSync(fullHelpDocsPath, 'utf8');

const modifiedContent = `---
sidebar_position: 30
description: This document contains the help content for the stellar command-line program.
---

${fullHelpDocsContent}
`;

fs.writeFileSync("docs/tools/developer-tools/cli/stellar-cli.mdx", modifiedContent);

fs.cpSync(
  path.join(localRepoPath, 'cookbook'),
  'docs/build/guides/cli',
  { recursive: true },
);

execSync('yarn format:mdx');

console.log('All files processed successfully.');
