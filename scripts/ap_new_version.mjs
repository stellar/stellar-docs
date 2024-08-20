import fs from "fs";
import { exit } from "process";

const VERSION = process.argv[2]

let _, major, minor, patch

try {
    [_, major, minor, patch] = VERSION.match(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/)
} catch (e) {
    console.error(`Error: invalid version string. Expected semantic version like \`1.2.3\`, received \`${VERSION}\``)
    exit(1)
}

fs.copyFileSync('openapi/anchor-platform/bundled-platform.yaml', `openapi/anchor-platform/versions/platform-${VERSION}.yaml`)
fs.copyFileSync('openapi/anchor-platform/bundled-callbacks.yaml', `openapi/anchor-platform/versions/callbacks-${VERSION}.yaml`)
fs.copyFileSync('openapi/anchor-platform/bundled-custody.yaml', `openapi/anchor-platform/versions/custody-${VERSION}.yaml`)
