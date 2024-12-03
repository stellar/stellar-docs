import React from "react";
import CodeBlock from "@theme/CodeBlock";
import { latestVersion } from "@site/src/helpers/stellarCli";

export function StellarCliWingetVersion() {
  const command = `winget install --id Stellar.StellarCLI --version ${latestVersion}`;

  return <CodeBlock language="powershell">{command}</CodeBlock>;
}
