export function getShell() {
  if (!globalThis.navigator) {
    return "bash";
  }

  return navigator.userAgent.match(/Windows/) ? "powershell" : "bash";
}
