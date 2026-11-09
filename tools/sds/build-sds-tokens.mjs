// Generates sds-tokens.css at the docs root from the pinned @stellar/design-system in package.json.
// Keeps only --sds-* custom properties. Light and shared tokens go on :root, dark tokens on html.dark.
import fs from "node:fs";
import { createRequire } from "node:module";
import postcss from "postcss";

const require = createRequire(import.meta.url);
const pkgDir = require.resolve("@stellar/design-system/package.json").replace(/package\.json$/, "");
const { version } = JSON.parse(fs.readFileSync(pkgDir + "package.json", "utf8"));
const src = fs.readFileSync(pkgDir + "build/styles.min.css", "utf8");

const out = postcss.root();
out.append(postcss.rule({ selector: ":root" }).append({ prop: "--sds-version", value: `"${version}"` }));
postcss.parse(src).walkRules((rule) => {
  const themeSelectors = rule.selectors.filter((s) => /^(:root|\.sds-theme-(light|dark))$/.test(s));
  if (themeSelectors.length !== rule.selectors.length) return;
  const tokens = rule.nodes.filter((n) => n.type === "decl" && n.prop.startsWith("--sds-"));
  if (!tokens.length) return;
  const isDark = rule.selectors.length === 1 && rule.selectors[0] === ".sds-theme-dark";
  const selectors = isDark ? ["html.dark", 'html[data-theme="dark"]'] : [":root"];
  out.append(postcss.rule({ selectors }).append(tokens.map((t) => t.clone())));
});

const header = `/* Generated from @stellar/design-system@${version} build/styles.min.css. Do not edit by hand.
   Regenerate: cd tools/sds && npm install && npm run build */\n`;
fs.writeFileSync(new URL("../../sds-tokens.css", import.meta.url), header + out.toString() + "\n");
console.log(`sds-tokens.css written from @stellar/design-system@${version}`);
