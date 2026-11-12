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

// Find the latest release tag without cloning.
const tag = execFileSync("git", [
  "ls-remote",
  "--tags",
  "--refs",
  "--sort=-v:refname",
  repoUrl,
])
  .toString()
  .split(/\r?\n/)
  .map((line) => line.split("\t")[1]?.replace("refs/tags/", ""))
  .find((tag) => tag && !tag.match(/rc|preview/));
const latestVersion = tag.substring(1).trim();

// A tag, branch, commit SHA, or PR merge ref. `pr/<n>/merge` and
// `origin/pr/<n>/merge` are accepted for compatibility with older callers.
const cliRef = (argv.cliRef || `v${latestVersion}`)
  .replace(/^origin\//, "")
  .replace(/^pr\/(\d+)\/merge$/, "refs/pull/$1/merge");
if (cliRef.startsWith("-")) {
  throw new Error(`Invalid cli ref: ${cliRef}`);
}

console.log("the latest version is", latestVersion);
console.log("using cli ref to fetch cli docs: ", cliRef);

// Fetch only that commit, and check out only the files this script uses.
console.log("Fetching cookbook and help docs...");
const git = (...args) => execFileSync("git", args, { cwd: localRepoPath });
fs.mkdirSync(localRepoPath);
git("init", "--quiet");
git("remote", "add", "origin", repoUrl);
git("sparse-checkout", "set", "--no-cone", "/cookbook/", "/FULL_HELP_DOCS.md");
git("fetch", "--quiet", "--depth=1", "--filter=blob:none", "origin", cliRef);
git("checkout", "--quiet", "FETCH_HEAD");

// Copy FULL_HELP_DOCS.md
const fullHelpDocsPath = path.join(localRepoPath, "FULL_HELP_DOCS.md");
// Drop the leading H1; the page title comes from the front matter.
const fullHelpDocsContent = fs
  .readFileSync(fullHelpDocsPath, "utf8")
  .replace(/^# .*\n+/, "");

const modifiedContent = `---
title: Stellar CLI Manual
description: This document contains the help content for the Stellar command-line program.
---

${fullHelpDocsContent}
`;

fs.writeFileSync("docs/tools/cli/stellar-cli.mdx", modifiedContent);

fs.cpSync(path.join(localRepoPath, "cookbook"), "docs/tools/cli/cookbook", {
  recursive: true,
});

execFileSync("pnpm", ["format:mdx"]);

console.log("All files processed successfully.");
