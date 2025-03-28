import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";

const repoUrl = "https://github.com/stellar/stellar-cli.git";
const localRepoPath = "./stellar-cli-repo";

// Remove the existing repo if it exists
if (fs.existsSync(localRepoPath)) {
  console.log("Removing existing repository...");
  fs.removeSync(localRepoPath);
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
// TODO: https://github.com/stellar/stellar-cli/issues/1908
let clidDocsHash = "e4680d35b11f217ddd5403dc417a883bffbc387f"

console.log("the latest version is", latestVersion.toString());
console.log("using commit hash to fetch cli docs: ", clidDocsHash.toString());

// TODO: https://github.com/stellar/stellar-cli/issues/1908
// execSync(`cd ${localRepoPath} && git checkout --quiet v${latestVersion}`);
execSync(`cd ${localRepoPath} && git checkout --quiet ${clidDocsHash}`);

// Copy FULL_HELP_DOCS.md
const fullHelpDocsPath = path.join(localRepoPath, "FULL_HELP_DOCS.md");
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
  "docs/tools/cli/stellar-cli.mdx",
  modifiedContent,
);

fs.cpSync(path.join(localRepoPath, "cookbook"), "docs/build/guides/cli", {
  recursive: true,
});

execSync("yarn format:mdx");

console.log("All files processed successfully.");
