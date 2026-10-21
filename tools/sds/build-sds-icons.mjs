// Swaps Mintlify's icons for SDS icons without touching pages. Mintlify draws every library icon as a
// mask-image box whose inline style names the source file, so a CSS rule matching that file name can
// replace the mask. Copies the mapped SDS SVGs to img/sds-icons/ and writes sds-icons.css at the docs root.
// Add a row when a page starts using a new icon name; unmapped icons keep Mintlify's default.
// Language logos on code tabs (Mintlify's devicon set) stay as they are: SDS has no language logos.
import fs from "node:fs";
import { createRequire } from "node:module";

// Mintlify icon name (any Font Awesome style folder) -> SDS asset, as "icons/<name>" or "logos/<name>".
const MAP = {
  "file-lines": "icons/file-04",
  "box-archive": "icons/folder",
  "house": "icons/home-05",
  "magnifying-glass": "icons/search-md",
  "ellipsis-vertical": "icons/dots-vertical",
  "angle-right": "icons/chevron-right",
  "play": "icons/play",
  "newspaper": "icons/announcement-01",
  "cube": "icons/cube-01",
  "mobile-screen": "icons/phone-01",
  "bolt": "icons/zap",
  "wallet": "icons/wallet-02",
  "toolbox": "icons/tool-02",
  "message": "icons/message-square-01",
  "code": "icons/code-02",
  "discord": "logos/discord",
  "x-twitter": "logos/x-twitter",
  "youtube": "logos/youtube",
  "linkedin": "logos/linkedin",
};

const require = createRequire(import.meta.url);
const pkgDir = require.resolve("@stellar/design-system/package.json").replace(/package\.json$/, "");
const { version } = JSON.parse(fs.readFileSync(pkgDir + "package.json", "utf8"));
const outDir = new URL("../../img/sds-icons/", import.meta.url);
fs.mkdirSync(outDir, { recursive: true });

const rules = Object.entries(MAP).map(([fa, sds]) => {
  const file = sds.replace("/", "-") + ".svg";
  fs.copyFileSync(`${pkgDir}build/assets/${sds}.svg`, new URL(file, outDir));
  const url = `url("/img/sds-icons/${file}")`;
  return `[style*="/${fa}.svg"] { -webkit-mask-image: ${url} !important; mask-image: ${url} !important; ` +
    `-webkit-mask-size: contain !important; mask-size: contain !important; }`;
});

const header = `/* Generated from @stellar/design-system@${version} build/assets. Do not edit by hand.
   Regenerate: cd tools/sds && npm install && npm run build */\n`;
fs.writeFileSync(new URL("../../sds-icons.css", import.meta.url), header + rules.join("\n") + "\n");
console.log(`sds-icons.css: ${rules.length} icons from @stellar/design-system@${version}`);
