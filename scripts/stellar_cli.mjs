import fs from "fs-extra";
import path from "path";
import { execFileSync } from "child_process";
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

// Clone the repository
console.log("Cloning repository...");
execFileSync("git", ["clone", repoUrl, localRepoPath]);
execFileSync("git", ["fetch", "--all"], { cwd: localRepoPath });
execFileSync(
  "git",
  ["fetch", "origin", "+refs/pull/*/merge:refs/remotes/origin/pr/*/merge"],
  { cwd: localRepoPath },
);
const tag = execFileSync("git", ["tag"], { cwd: localRepoPath })
  .toString()
  .trimEnd()
  .split(/\r?\n/)
  .filter((tag) => !tag.match(/rc|preview/))
  .pop();
const latestVersion = tag.toString().substring(1).trim();
const cliRef = argv.cliRef || `v${latestVersion}`;

console.log("the latest version is", latestVersion.toString());
console.log("using cli ref to fetch cli docs: ", cliRef.toString());

execFileSync("git", ["checkout", "--quiet", cliRef], { cwd: localRepoPath });

// Copy FULL_HELP_DOCS.md
const fullHelpDocsPath = path.join(localRepoPath, "FULL_HELP_DOCS.md");
const fullHelpDocsContent = fs.readFileSync(fullHelpDocsPath, "utf8");

const modifiedContent = `---
sidebar_position: 10
description: This document contains the help content for the Stellar command-line program.
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

execFileSync("pnpm", ["format:mdx"]);

console.log("All files processed successfully.");
