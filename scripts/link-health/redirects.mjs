// Check that pages keep working URLs after they move.
//
// nginx/includes/redirects.conf holds the server-side redirects, and
// routes.txt lists every page the build produces. This script emulates how
// nginx/nginx.conf serves a path: the server-level rewrites run first, then
// `location /` strips a trailing slash, then try_files serves the page or a
// static file.
//
// - Full mode (default): every rewrite target must resolve, and every route
//   that was ever in routes.txt must still resolve, directly or through
//   redirects. Findings go to the report. The exit code is 0.
// - PR mode (--pr <base>): check only the routes that the change removes and
//   the rewrites that it adds. The exit code is 1 when one of them fails, so
//   a page cannot disappear without a redirect.
//
// Usage:
//   node scripts/link-health/redirects.mjs [--json out.json]
//   node scripts/link-health/redirects.mjs --pr origin/main [--head HEAD]

import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const REDIRECTS_FILE = "nginx/includes/redirects.conf";
const ROUTES_FILE = "routes.txt";
const MAX_HOPS = 10;

// Routes that come and go as content grows (blog pagination, tag pages).
// They are not pages that anyone links to, so a missing redirect is not a
// finding.
const VOLATILE_ROUTE =
  /^\/meetings\/(page\/\d+|tags(\/.*)?|archive|authors(\/.*)?)$/;

// Remove an nginx comment. A `#` inside quotes is part of the value (for
// example, an anchor in a quoted redirect target).
export function stripComment(line) {
  let quote = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quote) {
      if (c === "\\") i++;
      else if (c === quote) quote = null;
    } else if (c === '"' || c === "'") {
      quote = c;
    } else if (c === "#") {
      return line.slice(0, i);
    }
  }
  return line;
}

// Split an nginx directive into tokens. A regex that contains `{}` must be
// quoted (see CONTRIBUTING.md), so quoted tokens keep their content as is.
export function tokenize(line) {
  const tokens = [];
  const re = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|([^\s;"']+)/g;
  let m;
  while ((m = re.exec(line))) {
    const quoted = m[1] ?? m[2];
    tokens.push(
      quoted !== undefined ? quoted.replace(/\\(["'])/g, "$1") : m[3],
    );
  }
  return tokens;
}

// Parse the `rewrite` directives of a redirects file, in file order.
export function parseRewrites(text) {
  const rules = [];
  text.split("\n").forEach((raw, i) => {
    const line = stripComment(raw).trim();
    if (!/^rewrite\s/.test(line)) return;
    const [, pattern, replacement, flag = null] = tokenize(line);
    const rule = {
      line: i + 1,
      pattern,
      replacement,
      flag,
      regex: null,
      error: null,
    };
    try {
      rule.regex = new RegExp(pattern);
    } catch (e) {
      rule.error = e.message;
    }
    rules.push(rule);
  });
  return rules;
}

// Return the first rewrite that matches the path, with `$n` filled in.
export function rewriteOnce(rules, uri) {
  for (const rule of rules) {
    if (!rule.regex) continue;
    const m = rule.regex.exec(uri);
    if (!m) continue;
    const target = rule.replacement.replace(
      /\$(\d)/g,
      (_, d) => m[Number(d)] ?? "",
    );
    return { rule, target };
  }
  return null;
}

// Follow the rules that nginx applies to a path, and report whether a page or
// a static file answers at the end.
export function resolve(rules, exists, uri) {
  const hops = [];
  let current = uri;
  for (let i = 0; i <= MAX_HOPS; i++) {
    const clean = current.replace(/[?#].*$/, "") || "/";
    const hit = rewriteOnce(rules, clean);
    if (hit) {
      hops.push({ line: hit.rule.line, to: hit.target });
      if (/^https?:\/\//i.test(hit.target)) {
        const url = new URL(hit.target);
        if (url.hostname !== "developers.stellar.org") {
          return { ok: true, external: true, final: hit.target, hops };
        }
        current = url.pathname;
      } else {
        current = hit.target;
      }
      continue;
    }
    if (clean.length > 1 && clean.endsWith("/")) {
      hops.push({ line: null, to: clean.slice(0, -1) });
      current = clean.slice(0, -1);
      continue;
    }
    if (exists(clean)) return { ok: true, final: clean, hops };
    return { ok: false, final: clean, hops };
  }
  return { ok: false, final: current, hops, loop: true };
}

// Build the existence test: a route from routes.txt, or a file in static/.
export function makeExists(routes, root = ROOT) {
  return (uri) => {
    if (routes.has(uri)) return true;
    const file = path.join(root, "static", decodeURI(uri));
    if (!file.startsWith(path.join(root, "static") + path.sep)) return false;
    return existsSync(file) && statSync(file).isFile();
  };
}

export function parseRoutes(text) {
  return new Set(
    text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("/")),
  );
}

// Collect the routes that a routes.txt patch adds (`+`) and removes (`-`).
export function routesInPatch(patch) {
  const added = new Set();
  const removed = new Set();
  for (const line of patch.split("\n")) {
    if (line.startsWith("+/")) added.add(line.slice(1).trim());
    else if (line.startsWith("-/")) removed.add(line.slice(1).trim());
  }
  return { added, removed };
}

// Collect the rewrite lines that a redirects.conf patch adds.
export function rewritesInPatch(patch) {
  const added = [];
  for (const line of patch.split("\n")) {
    if (line.startsWith("+") && !line.startsWith("+++")) {
      const body = stripComment(line.slice(1)).trim();
      if (/^rewrite\s/.test(body)) added.push(body);
    }
  }
  return added;
}

function describe(result) {
  if (result.loop) return "the redirect chain loops or has more than 10 hops";
  if (result.hops.length === 0) return "no redirect matches this path";
  return `the redirect chain ends at ${result.final}, which does not exist`;
}

// Check the rewrite targets that do not depend on the matched path. `only`
// limits the check to some rules; resolution always uses all rules.
export function checkTargets(rules, exists, only = rules) {
  const problems = [];
  for (const rule of only) {
    if (rule.error) {
      problems.push({
        kind: "rewrite-regex",
        line: rule.line,
        path: rule.pattern,
        detail: `the regex does not compile in the emulation: ${rule.error}`,
      });
      continue;
    }
    if (/\$\d/.test(rule.replacement) || /^https?:\/\//i.test(rule.replacement))
      continue;
    const result = resolve(rules, exists, rule.replacement);
    if (!result.ok) {
      problems.push({
        kind: "rewrite-target",
        line: rule.line,
        path: rule.replacement,
        detail: `the target does not resolve: ${describe(result)}`,
        hops: result.hops,
      });
    }
  }
  return problems;
}

// Check that each route still resolves, directly or through redirects.
export function checkRoutes(rules, exists, routeList, kind) {
  const problems = [];
  for (const route of routeList) {
    const result = resolve(rules, exists, route);
    if (!result.ok) {
      problems.push({
        kind,
        path: route,
        detail: describe(result),
        hops: result.hops,
      });
    }
  }
  return problems;
}

function git(args) {
  return execFileSync("git", args, {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  });
}

function readAt(ref, file) {
  if (!ref) return readFileSync(path.join(ROOT, file), "utf8");
  return git(["show", `${ref}:${file}`]);
}

export function runFull() {
  const rules = parseRewrites(readAt(null, REDIRECTS_FILE));
  const routes = parseRoutes(readAt(null, ROUTES_FILE));
  const exists = makeExists(routes);
  const history = git([
    "log",
    "--format=",
    "-p",
    "-U0",
    "--no-ext-diff",
    "--",
    ROUTES_FILE,
  ]);
  const { added: everListed } = routesInPatch(history);
  const gone = [...everListed]
    .filter((r) => !routes.has(r) && !VOLATILE_ROUTE.test(r))
    .sort();
  const problems = [
    ...checkTargets(rules, exists),
    ...checkRoutes(rules, exists, gone, "removed-route"),
  ];
  return {
    mode: "full",
    ok: problems.length === 0,
    checked: {
      rewrites: rules.length,
      routes: routes.size,
      removedRoutes: gone.length,
    },
    problems,
  };
}

export function runPr(base, head = "HEAD") {
  const range = `${base}...${head}`;
  const routesPatch = git([
    "diff",
    "-U0",
    "--no-ext-diff",
    range,
    "--",
    ROUTES_FILE,
  ]);
  const redirectsPatch = git([
    "diff",
    "-U0",
    "--no-ext-diff",
    range,
    "--",
    REDIRECTS_FILE,
  ]);
  const ref = head === "HEAD" ? null : head;
  const rules = parseRewrites(readAt(ref, REDIRECTS_FILE));
  const routes = parseRoutes(readAt(ref, ROUTES_FILE));
  const exists = makeExists(routes);
  const { added, removed } = routesInPatch(routesPatch);
  const gone = [...removed]
    .filter((r) => !added.has(r) && !routes.has(r) && !VOLATILE_ROUTE.test(r))
    .sort();
  const newRules = parseRewrites(rewritesInPatch(redirectsPatch).join("\n"));
  const newLines = new Set(
    newRules.map((r) => `${r.pattern} ${r.replacement}`),
  );
  const touched = rules.filter((r) =>
    newLines.has(`${r.pattern} ${r.replacement}`),
  );
  const problems = [
    ...checkTargets(rules, exists, touched),
    ...checkRoutes(rules, exists, gone, "removed-route"),
  ];
  return {
    mode: "pr",
    range,
    ok: problems.length === 0,
    checked: { removedRoutes: gone.length, addedRewrites: touched.length },
    problems,
  };
}

function printProblems(result) {
  for (const p of result.problems) {
    const where = p.line ? `${REDIRECTS_FILE}:${p.line} ` : "";
    console.log(`- [${p.kind}] ${where}${p.path}: ${p.detail}`);
  }
}

function main(argv) {
  const arg = (name) => {
    const i = argv.indexOf(name);
    return i === -1 ? null : argv[i + 1];
  };
  const base = arg("--pr");
  const result = base ? runPr(base, arg("--head") ?? "HEAD") : runFull();
  const out = arg("--json");
  if (out) {
    mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
    writeFileSync(out, JSON.stringify(result, null, 2) + "\n");
  }
  const c = result.checked;
  if (result.mode === "pr") {
    console.log(
      `Checked ${c.removedRoutes} removed route(s) and ${c.addedRewrites} added rewrite(s) in ${result.range}.`,
    );
    if (result.ok) {
      console.log(
        "All removed routes resolve, and all added rewrites point to pages that exist.",
      );
      return 0;
    }
    printProblems(result);
    console.log(
      `\nEach page this change removes needs a redirect in ${REDIRECTS_FILE}.` +
        '\nPoint it at the page that replaces the old one. See "URLs are forever" in CONTRIBUTING.md.',
    );
    return 1;
  }
  console.log(
    `Checked ${c.rewrites} rewrites and ${c.removedRoutes} removed routes against ${c.routes} routes.`,
  );
  console.log(
    result.ok ? "No problems found." : `${result.problems.length} problem(s):`,
  );
  printProblems(result);
  return 0;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  process.exitCode = main(process.argv.slice(2));
}
