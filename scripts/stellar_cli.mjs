import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const repoUrl = "https://github.com/stellar/stellar-cli.git";
const localRepoPath = "./stellar-cli-repo";

const argv = yargs(hideBin(process.argv))
  .parserConfiguration({
    "strip-dashed": true,
  })
  .option("cli-ref", {
    type: "string",
    description: "Cli reference",
  })
  .parse();

// Remove the existing repo if it exists
if (fs.existsSync(localRepoPath)) {
  console.log("Removing existing repository...");
  fs.removeSync(localRepoPath);
}

// Perform a shallow clone of the repository
console.log("Cloning repository...");
execSync(`git clone ${repoUrl} ${localRepoPath}`);
execSync(
  `cd ${localRepoPath} && git fetch --all && git fetch origin '+refs/pull/*/merge:refs/remotes/origin/pr/*/merge'`,
);
const latestVersion = execSync(
  `cd ${localRepoPath} && git tag | grep -v -E 'rc|preview' | tail -n1`,
)
  .toString()
  .substring(1)
  .trim();

const cliRef = argv.cliRef || `v${latestVersion}`;

console.log("the latest version is", latestVersion.toString());
console.log("using cli ref to fetch cli docs: ", cliRef.toString());

execSync(`cd ${localRepoPath} && git checkout --quiet ${cliRef}`);

// Copy FULL_HELP_DOCS.md
const fullHelpDocsPath = path.join(localRepoPath, "FULL_HELP_DOCS.md");
const fullHelpDocsContent = fs.readFileSync(fullHelpDocsPath, "utf8");

const modifiedContent = `---
sidebar_position: 10
description: This document contains the help content for the stellar command-line program.
---

${fullHelpDocsContent}
`;

fs.writeFileSync(
  "src/helpers/stellarCli.ts",
  `export const latestVersion = "${latestVersion}";`,
);

fs.writeFileSync("docs/tools/cli/stellar-cli.mdx", modifiedContent);

fs.cpSync(path.join(localRepoPath, "cookbook"), "docs/tools/cli/cookbook", {
  recursive: true,
});

execSync("yarn format:mdx");

console.log("All files processed successfully.");
