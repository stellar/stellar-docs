export function getPlatform() {
  return navigator.userAgent.match(/Windows/) ? "windows" : "unix";
}
