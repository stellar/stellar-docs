#!/usr/bin/env node
// Generates the OpenRPC method pages from the built specs.
//
// Each method page has a generated block between the `rpc-method` comment
// markers. This script rewrites that block from the spec and leaves the rest of
// the page (frontmatter, hand-written prose before and after the block) alone.
// A method with no page yet gets a new one, which still needs to be added to
// `docs.json` and to the methods index page.
//
// Run `pnpm rpcspec:build` first: this reads the built, dereferenced
// `*.openrpc.json` files, not `openrpc/src`.
//
// Usage: node openrpc/scripts/docs.mjs [--check]
// With --check, prints the pages that are out of date and exits 1 instead of
// writing them.
import fs from "node:fs";
import path from "node:path";
import * as prettier from "prettier";

const TARGETS = [
  {
    spec: "stellar-rpc.openrpc.json",
    dir: "docs/data/apis/rpc/api-reference/methods",
    url: "https://soroban-testnet.stellar.org",
  },
  {
    spec: "stellar-rpc-beta.openrpc.json",
    dir: "docs/data/apis/rpc/api-reference/methods",
    url: "https://soroban-testnet.stellar.org",
  },
  {
    spec: "docs/platforms/anchor-platform/api-reference/platform/rpc/anchor-platform.openrpc.json",
    dir: "docs/platforms/anchor-platform/api-reference/platform/rpc/methods",
    url: "https://platform-server.exampleanchor.com",
  },
];

const OPEN = "{/* rpc-method: generated from the OpenRPC spec */}";
const CLOSE = "{/* /rpc-method */}";
const BY_NAME_TIP =
  "Please note that parameter structure within the request must contain named parameters as a by-name object, and not as positional arguments in a by-position array";
const REQ_ID = 8675309;

// ---------- schema ----------

function typeLabel(schema = {}) {
  if (Array.isArray(schema.type)) return schema.type.join(" | ");
  const alts = schema.oneOf || schema.anyOf;
  if (!schema.type && alts) {
    return [...new Set(alts.map((a) => typeLabel(a)))].join(" | ");
  }
  if (schema.type === "array")
    return schema.items ? `${typeLabel(schema.items)}[]` : "array";
  if (!schema.type && schema.properties) return "object";
  if (!schema.type && schema.enum) return typeof schema.enum[0];
  return schema.type || "any";
}

// The object whose properties are listed under an <Expandable>, if any.
function nestedOf(schema = {}) {
  if (schema.type === "array" && schema.items?.properties) {
    return { title: "items", obj: schema.items };
  }
  if (schema.properties) return { title: "properties", obj: schema };
  return null;
}

function enumOf(schema = {}) {
  if (schema.enum) return schema.enum;
  if (schema.type === "array" && schema.items?.enum) return schema.items.enum;
  return null;
}

// Descriptions of an array's items (and of nested arrays' items), which often
// say what each element is: "A `TopicFilter` is `SegmentMatcher[]`".
function itemDescriptions(schema = {}) {
  const out = [];
  for (let s = schema; s.type === "array" && s.items; s = s.items) {
    const d = s.items.description?.trim();
    if (d) out.push(d);
  }
  return out;
}

function indentLines(text, pad) {
  return text
    .split("\n")
    .map((l) => (l ? pad + l : l))
    .join("\n");
}

// A <ParamField> or <ResponseField>. `descParts` are its description paragraphs.
function renderField(tag, attr, name, schema, required, descParts, pad) {
  const lines = [];
  const example =
    schema.example !== undefined
      ? ` example="${String(schema.example).replace(/"/g, "&quot;")}"`
      : "";
  lines.push(
    `${pad}<${tag} ${attr}="${name}" type="${typeLabel(schema)}"${example}${required ? " required" : ""}>`,
  );
  const inner = pad + "  ";
  const parts = descParts.map((d) => d?.trim()).filter((d) => d);
  for (const d of itemDescriptions(schema))
    if (!parts.includes(d)) parts.push(d);
  if (schema.example !== undefined && parts.length) {
    parts[parts.length - 1] += `<br />\nExample: \`${schema.example}\``;
  }
  if (parts.length) lines.push("", indentLines(parts.join("\n\n"), inner), "");
  const en = enumOf(schema);
  if (en) {
    lines.push(
      `${inner}Available options: ${en.map((v) => `\`${v}\``).join(", ")}`,
      "",
    );
  }
  if (schema.default !== undefined) {
    lines.push(`${inner}Default: \`${JSON.stringify(schema.default)}\``, "");
  }
  const nested = nestedOf(schema);
  if (nested) {
    lines.push(`${inner}<Expandable title="${nested.title}">`);
    const req = new Set(nested.obj.required || []);
    for (const [k, v] of Object.entries(nested.obj.properties)) {
      lines.push(
        renderField(tag, attr, k, v, req.has(k), [v.description], inner + "  "),
      );
    }
    // A blank line closes only a top-level field's <Expandable>, as on the
    // existing pages.
    lines.push(...(pad ? [] : [""]), `${inner}</Expandable>`);
  }
  lines.push(`${pad}</${tag}>`);
  return lines.join("\n");
}

function renderParam(p) {
  const s = p.schema || {};
  const parts = [p.description];
  if (s.description && s.description !== p.description)
    parts.push(s.description);
  return renderField(
    "ParamField",
    "body",
    p.name,
    s,
    p.required === true,
    parts,
    "",
  );
}

function renderResult(result) {
  const out = [`*(${result.name})*`];
  if (result.description) out.push(result.description);
  const s = result.schema || {};
  const req = new Set(s.required || []);
  if (s.properties) {
    for (const [k, v] of Object.entries(s.properties)) {
      out.push(
        renderField(
          "ResponseField",
          "name",
          k,
          v,
          req.has(k),
          [v.description],
          "",
        ),
      );
    }
  } else {
    out.push(
      renderField(
        "ResponseField",
        "name",
        result.name,
        s,
        false,
        [s.description],
        "",
      ),
    );
  }
  return out.join("\n\n");
}

// ---------- examples ----------

function requestBody(method, ex) {
  const body = { jsonrpc: "2.0", id: REQ_ID, method: method.name };
  if (ex.params?.length) {
    body.params =
      method.paramStructure === "by-position"
        ? ex.params.map((p) => p.value)
        : Object.fromEntries(ex.params.map((p) => [p.name, p.value]));
  }
  return body;
}

function renderExample(method, ex, url) {
  const body = requestBody(method, ex);
  const j2 = JSON.stringify(body, null, 2);
  const j4 = JSON.stringify(body, null, 4);
  const out = [];
  if (ex.description) out.push(ex.description);
  out.push("**Request**");
  out.push(
    [
      "<CodeGroup>",
      "",
      "```bash cURL",
      "curl -X POST \\",
      "-H 'Content-Type: application/json' \\",
      `-d '${j2}' \\`,
      `${url} | jq`,
      "```",
      "",
      "```js JavaScript",
      `let requestBody = ${j2}`,
      `let res = await fetch('${url}', {`,
      "  method: 'POST',",
      "  headers: {",
      "    'Content-Type': 'application/json',",
      "  },",
      "  body: JSON.stringify(requestBody),",
      "})",
      "let json = await res.json()",
      "console.log(json)",
      "```",
      "",
      "```python Python",
      "import json, requests",
      `res = requests.post("${url}", json=${j4})`,
      "print(json.dumps(res.json(), indent=4))",
      "```",
      "",
      "```json JSON",
      j2,
      "```",
      "",
      "</CodeGroup>",
    ].join("\n"),
  );
  if (ex.result) {
    const res = { jsonrpc: "2.0", id: REQ_ID, result: ex.result.value };
    out.push("**Result**");
    out.push("```json\n" + JSON.stringify(res, null, 2) + "\n```");
  }
  return out.join("\n\n");
}

function renderExamples(method, url) {
  const exs = method.examples || [];
  if (!exs.length) return null;
  if (exs.length === 1)
    return `## Example\n\n${renderExample(method, exs[0], url)}`;
  const tabs = exs.map(
    (ex) =>
      `<Tab title="${ex.name}">\n\n${renderExample(method, ex, url)}\n\n</Tab>`,
  );
  return `## Examples\n\n<Tabs>\n${tabs.join("\n")}\n</Tabs>`;
}

function renderBlock(method, url) {
  const out = [OPEN];
  if (method.tags?.length)
    out.push(method.tags.map((t) => `\`${t.name}\``).join(" "));
  if (method.description) out.push(method.description);
  const params = method.params || [];
  out.push(`## Params (${params.length})`);
  if (params.length && method.paramStructure === "by-name") {
    out.push(`<Tip>\n\n${BY_NAME_TIP}\n\n</Tip>`);
  }
  for (const p of params) out.push(renderParam(p));
  if (method.result) {
    out.push("## Result");
    out.push(renderResult(method.result));
  }
  const ex = renderExamples(method, url);
  if (ex) out.push(ex);
  out.push(CLOSE);
  return out.join("\n\n");
}

// ---------- pages ----------

// A one-line page description from the method summary: "returns node health"
// becomes "Returns node health".
function describe(method) {
  const s = (method.summary || method.description || "").split("\n")[0].trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function yamlString(s) {
  return /^[\w ,.()'-]+$/.test(s) && !/^[-\d]/.test(s) ? s : JSON.stringify(s);
}

function newPage(method, block) {
  return `---\ntitle: ${method.name}\ndescription: ${yamlString(describe(method))}\n---\n\n${block}\n`;
}

// Replaces the generated block of an existing page, and repairs a missing or
// broken frontmatter description.
function updatePage(src, method, block, file) {
  const start = src.indexOf(OPEN);
  const end = src.indexOf(CLOSE);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`${file}: missing the ${OPEN} ... ${CLOSE} markers`);
  }
  let head = src.slice(0, start);
  const tail = src.slice(end + CLOSE.length);
  head = head.replace(/^(---\n[\s\S]*?)(\n---\n)/, (fm, body, close) => {
    const m = body.match(/^description:\s*(.*)$/m);
    const current = m ? m[1].replace(/^"|"$/g, "").trim() : "";
    if (current && !current.startsWith("<")) return fm;
    const line = `description: ${yamlString(describe(method))}`;
    return (
      (m ? body.replace(/^description:.*$/m, line) : `${body}\n${line}`) + close
    );
  });
  return head + block + tail;
}

async function format(text, file) {
  const options = (await prettier.resolveConfig(file)) ?? {};
  return prettier.format(text, { ...options, filepath: file });
}

// ---------- main ----------

const check = process.argv.includes("--check");
const stale = [];
const created = [];
const generated = new Map(); // dir -> Set of method names

for (const target of TARGETS) {
  const raw = fs.readFileSync(target.spec, "utf8");
  if (raw.includes('"$ref"')) {
    throw new Error(
      `${target.spec} has $ref entries. Run \`pnpm rpcspec:build\` first.`,
    );
  }
  const spec = JSON.parse(raw);
  const names = generated.get(target.dir) ?? new Set();
  generated.set(target.dir, names);

  for (const method of spec.methods) {
    names.add(method.name);
    const file = path.join(target.dir, `${method.name}.mdx`);
    const block = renderBlock(method, target.url);
    const exists = fs.existsSync(file);
    const src = exists ? fs.readFileSync(file, "utf8") : null;
    const out = await format(
      exists ? updatePage(src, method, block, file) : newPage(method, block),
      file,
    );
    if (out === src) continue;
    stale.push(file);
    if (!exists) created.push(file);
    if (!check) fs.writeFileSync(file, out);
  }
}

// Pages with a generated block whose method is no longer in any spec.
const orphans = [];
for (const [dir, names] of generated) {
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".mdx") || names.has(f.slice(0, -4))) continue;
    if (fs.readFileSync(path.join(dir, f), "utf8").includes(OPEN))
      orphans.push(path.join(dir, f));
  }
}

for (const file of stale) {
  console.log(
    `${check ? "out of date" : created.includes(file) ? "created" : "updated"}: ${file}`,
  );
}
for (const file of created) {
  console.log(
    `  add ${file.replace(/\.mdx$/, "")} to docs.json and to the methods index page`,
  );
}
for (const file of orphans) {
  console.log(
    `no longer in the spec: ${file} (delete it, and remove it from docs.json and the index)`,
  );
}
if (check && stale.length) {
  console.log(
    "Run `pnpm rpcspec:build && pnpm rpcspec:docs` and commit the result.",
  );
}
process.exit(check && (stale.length || orphans.length) ? 1 : 0);
