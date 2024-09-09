import fs from "fs-extra";
import path from 'path';
import { execSync } from 'child_process';

const repoUrl = 'https://github.com/stellar/stellar-cli.git';
const localRepoPath = './stellar-cli-repo';
const sourcePath = 'cookbook';
const targetDir = 'docs/build/guides/cli/';

// Clone or update the repository
if (!fs.existsSync(localRepoPath)) {
  console.log('Cloning repository...');
  execSync(`git clone ${repoUrl} ${localRepoPath}`);
} else {
  console.log('Updating repository...');
  execSync('git pull', { cwd: localRepoPath });
}

// Ensure the target directory exists
fs.ensureDirSync(targetDir);

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

// Copy mdx files from the CLI to the guides section
const sourceDir = path.join(localRepoPath, sourcePath);

function copyMdxFiles(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const sourcePath = path.join(dir, file);
    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      copyMdxFiles(sourcePath);
    } else if (path.extname(file) === '.mdx') {
      const relativePath = path.relative(sourceDir, sourcePath);
      const targetPath = path.join(targetDir, relativePath);
      fs.ensureDirSync(path.dirname(targetPath));
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied ${relativePath}`);
    }
  }
}

copyMdxFiles(sourceDir);

console.log('All files processed successfully.');
