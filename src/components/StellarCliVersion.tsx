import React from "react";
import CodeBlock from "@theme/CodeBlock";
import { latestVersion } from "@site/src/helpers/stellarCli";

export function StellarCliVersion() {
  const command = `cargo install --locked stellar-cli@${latestVersion} --features opt`;

  return <CodeBlock language="sh">{command}</CodeBlock>;
}
