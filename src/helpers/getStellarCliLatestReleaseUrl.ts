import { latestVersion } from "@site/src/helpers/stellarCli";

export function getStellarCliLatestReleaseUrl() {
  return `https://github.com/stellar/stellar-cli/releases/download/v${latestVersion}/stellar-cli-installer-${latestVersion}-x86_64-pc-windows-msvc.exe`;
}
