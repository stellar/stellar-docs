export function getPlatform() {
  if (!globalThis.navigator) {
    return "unix";
  }

  return navigator.userAgent.match(/Windows/) ? "windows" : "unix";
}
