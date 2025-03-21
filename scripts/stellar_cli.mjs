import fs from "fs-extra";
import path from "path";
import {execSync} from "child_process";
import * as tar from 'tar'
import {finished} from "stream/promises";
import {Readable} from "stream"

const localArtifactPath = "./stellar-cli-artifacts"

// Remove the existing artifact if it exists
if (fs.existsSync(localArtifactPath)) {
    console.log("Removing existing artifacts...");
    fs.removeSync(localArtifactPath);
}
fs.mkdirSync(localArtifactPath)

const resp = await fetch("https://api.github.com/repos/stellar/stellar-cli/tags")
const json = await resp.json()
const latestVersion = json[0].name.replace("v", "")

const url = `https://github.com/stellar/stellar-cli/releases/download/v${latestVersion}/stellar-cli-${latestVersion}-docs-cookbook.tar.gz`
const blob = await fetch(url);
await finished(Readable.fromWeb(blob.body).pipe(
    tar.x({
        C: `${localArtifactPath}`,
        z: true
    }),
));

console.log("the latest version is", latestVersion.toString());

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
