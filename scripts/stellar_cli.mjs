import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";

const repoUrl = "https://github.com/stellar/stellar-cli.git";
const localRepoPath = "./stellar-cli-repo";
const localArtifactPath = "./stellar-cli-artifacts"

// Remove the existing repo if it exists
if (fs.existsSync(localRepoPath)) {
  console.log("Removing existing repository...");
  fs.removeSync(localRepoPath);
}
if (fs.existsSync(localArtifactPath)) {
  console.log("Removing existing artifacts...");
  fs.removeSync(localArtifactPath);
}


// Perform a shallow clone of the repository
console.log("Cloning repository...");
execSync(`git clone ${repoUrl} ${localRepoPath}`);
let latestVersion = execSync(
  `cd ${localRepoPath} && git tag | grep -v -E 'rc|preview' | tail -n1`,
)
  .toString()
  .substring(1)
  .trim();

console.log("the latest version is", latestVersion.toString());

execSync(`wget https://github.com/stellar/stellar-cli/releases/download/v${latestVersion}/stellar-cli-${latestVersion}-docs-cookbook.tar.gz -P ${localArtifactPath}`);
execSync(`tar xzvf ${localArtifactPath}/stellar-cli-${latestVersion}-docs-cookbook.tar.gz -C ${localArtifactPath}`);

// Copy FULL_HELP_DOCS.md
const fullHelpDocsPath = path.join(localArtifactPath, "FULL_HELP_DOCS.md");
const fullHelpDocsContent = fs.readFileSync(fullHelpDocsPath, "utf8");

const modifiedContent = `---
sidebar_position: 30
description: This document contains the help content for the stellar command-line program.
---

${fullHelpDocsContent}
`;

fs.writeFileSync(
  "src/helpers/stellarCli.ts",
  `export const latestVersion = "${latestVersion}";`,
);

fs.writeFileSync(
  "docs/tools/developer-tools/cli/stellar-cli.mdx",
  modifiedContent,
);

fs.cpSync(path.join(localArtifactPath, "cookbook"), "docs/build/guides/cli", {
  recursive: true,
});

execSync("yarn format:mdx");

console.log("All files processed successfully.");
