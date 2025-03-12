import React from "react";
import CodeBlock from "@theme/CodeBlock";
import { latestVersion } from "@site/src/helpers/stellarCli";

export function StellarCliGitHubVersion() {
  const command = `uses: stellar/stellar-cli@v${latestVersion}`;

  return <CodeBlock language="yaml">{command}</CodeBlock>;
}
