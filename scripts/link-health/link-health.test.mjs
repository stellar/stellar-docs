import { test } from "node:test";
import assert from "node:assert/strict";

import {
  checkRoutes,
  checkTargets,
  parseRewrites,
  resolve,
  rewritesInPatch,
  routesInPatch,
  stripComment,
  tokenize,
} from "./redirects.mjs";
import {
  CHANNEL_RE,
  INVITE_RE,
  REPO_RE,
  checkInvite,
  checkRepo,
  classifyDiscord,
  collectRepos,
  scan,
} from "./pointers.mjs";
import { buildReport, code, groupRoutes, summarizeLychee } from "./report.mjs";
import { decide } from "./issue.mjs";

const existsIn = (...routes) => {
  const set = new Set(routes);
  return (uri) => set.has(uri);
};

// A fake fetch that answers with fixed JSON per URL.
const fakeFetch = (table) => async (url) => {
  const hit = table[url];
  if (hit instanceof Error) throw hit;
  const { status = 200, body = null, headers = {} } = hit ?? { status: 404 };
  return {
    status,
    url,
    headers: new Map(Object.entries(headers)),
    json: async () => body,
  };
};

// ---------------------------------------------------------------- redirects

test("stripComment keeps a # that is inside quotes", () => {
  assert.equal(
    stripComment('rewrite ^/a$ "/b#anchor" permanent; # note'),
    'rewrite ^/a$ "/b#anchor" permanent; ',
  );
});

test("tokenize reads quoted regexes that contain braces", () => {
  assert.deepEqual(tokenize('rewrite "^/m/([0-9]{4})$" /n/$1 permanent;'), [
    "rewrite",
    "^/m/([0-9]{4})$",
    "/n/$1",
    "permanent",
  ]);
});

test("parseRewrites reads rules in file order and skips comments", () => {
  const rules = parseRewrites(
    [
      "# header",
      "rewrite ^/a$ /b permanent;",
      "",
      'rewrite "^/c/(\\d{2})$" /d/$1 permanent;',
    ].join("\n"),
  );
  assert.equal(rules.length, 2);
  assert.equal(rules[0].line, 2);
  assert.equal(rules[1].pattern, "^/c/(\\d{2})$");
  assert.ok(rules[1].regex.test("/c/42"));
});

test("resolve follows a chain of redirects and fills capture groups", () => {
  const rules = parseRewrites(
    "rewrite ^/old/(.*)$ /mid/$1 permanent;\nrewrite ^/mid/(.*)$ /new/$1 permanent;",
  );
  const r = resolve(rules, existsIn("/new/page"), "/old/page");
  assert.equal(r.ok, true);
  assert.equal(r.final, "/new/page");
  assert.equal(r.hops.length, 2);
});

test("resolve ignores the anchor and strips a trailing slash, as nginx does", () => {
  const rules = parseRewrites('rewrite ^/a$ "/b/#part" permanent;');
  assert.equal(resolve(rules, existsIn("/b"), "/a").ok, true);
});

test("resolve runs the server rewrites before it serves an existing page", () => {
  // nginx applies redirects.conf before try_files, so the redirect wins.
  const rules = parseRewrites("rewrite ^/a$ /gone permanent;");
  const r = resolve(rules, existsIn("/a"), "/a");
  assert.equal(r.ok, false);
  assert.equal(r.final, "/gone");
});

test("resolve reports a redirect loop", () => {
  const rules = parseRewrites(
    "rewrite ^/a$ /b permanent;\nrewrite ^/b$ /a permanent;",
  );
  assert.equal(resolve(rules, existsIn(), "/a").loop, true);
});

test("resolve accepts a redirect to another site", () => {
  const rules = parseRewrites("rewrite ^/x$ https://stellar.org/x permanent;");
  assert.equal(resolve(rules, existsIn(), "/x").external, true);
});

test("checkTargets flags a fixed target that does not exist", () => {
  // The same typo as nginx/includes/redirects.conf line 11 today.
  const rules = parseRewrites(
    "rewrite ^/docs/glossary/federation$ /docs/learn/encyclopedia/network-configurationfederation permanent;",
  );
  const problems = checkTargets(
    rules,
    existsIn("/docs/learn/encyclopedia/network-configuration/federation"),
  );
  assert.equal(problems.length, 1);
  assert.equal(problems[0].kind, "rewrite-target");
});

test("checkTargets skips targets with capture groups", () => {
  const rules = parseRewrites("rewrite ^/a/(.*)$ /b/$1 permanent;");
  assert.deepEqual(checkTargets(rules, existsIn()), []);
});

test("routesInPatch and rewritesInPatch read a git diff", () => {
  const routes = routesInPatch(
    "--- a/routes.txt\n+++ b/routes.txt\n@@ -5 +5 @@\n-/docs/old\n+/docs/new\n",
  );
  assert.deepEqual([...routes.removed], ["/docs/old"]);
  assert.deepEqual([...routes.added], ["/docs/new"]);
  const added = rewritesInPatch(
    "+++ b/nginx/includes/redirects.conf\n+rewrite ^/a$ /b permanent;\n+# comment\n-rewrite ^/c$ /d permanent;\n",
  );
  assert.deepEqual(added, ["rewrite ^/a$ /b permanent;"]);
});

test("a page removed without a redirect fails, like the #2854 regression", () => {
  // In #1637 the SDEX page moved, and its old URL lost its redirect.
  const old =
    "/docs/learn/encyclopedia/sdex/liquidity-on-stellar-sdex-liquidity-pools";
  const now =
    "/docs/learn/fundamentals/liquidity-on-stellar-sdex-liquidity-pools";
  const before = checkRoutes(
    parseRewrites(""),
    existsIn(now),
    [old],
    "removed-route",
  );
  assert.equal(before.length, 1);
  const fix = parseRewrites(
    `rewrite ^/docs/learn/encyclopedia/sdex/(.*)$ /docs/learn/fundamentals/$1 permanent;`,
  );
  assert.deepEqual(checkRoutes(fix, existsIn(now), [old], "removed-route"), []);
});

// ---------------------------------------------------------------- pointers

const manifest = {
  discord: [
    { code: "stellardev", guildId: "897514728459468821" },
    { code: "thirdparty" },
  ],
  retiredDiscord: [{ code: "stellar", reason: "now an unrelated server" }],
};

test("INVITE_RE finds invite links but not server or channel links", () => {
  const text =
    "a https://discord.gg/stellardev b discord.com/invite/ZvGjVY5uvs c https://discord.com/channels/1/2";
  assert.deepEqual(
    [...text.matchAll(INVITE_RE)].map((m) => m[1]),
    ["stellardev", "ZvGjVY5uvs"],
  );
  assert.deepEqual(
    [...text.matchAll(CHANNEL_RE)].map((m) => m[1]),
    ["1"],
  );
});

test("classifyDiscord flags retired, unknown, and foreign-server links", () => {
  const read = () =>
    "discord.gg/stellardev\ndiscord.gg/stellar\ndiscord.gg/other\ndiscord.com/channels/123/4\ndiscord.com/channels/897514728459468821/5";
  const problems = classifyDiscord(
    scan(["x.md"], INVITE_RE, read),
    scan(["x.md"], CHANNEL_RE, read),
    manifest,
  );
  assert.deepEqual(
    problems.map((p) => [p.kind, p.line]),
    [
      ["discord-retired", 2],
      ["discord-unknown", 3],
      ["discord-channel-server", 4],
    ],
  );
});

test("checkInvite compares the server with the manifest", async () => {
  const api = "https://discord.com/api/v10/invites/";
  const ok = await checkInvite(
    manifest.discord[0],
    fakeFetch({
      [`${api}stellardev`]: {
        body: {
          guild: { id: "897514728459468821", name: "Stellar Developers" },
        },
      },
    }),
  );
  assert.equal(ok.problem, undefined);
  const wrong = await checkInvite(
    manifest.discord[0],
    fakeFetch({
      [`${api}stellardev`]: {
        body: { guild: { id: "1", name: "Someone else" } },
      },
    }),
  );
  assert.equal(wrong.problem.kind, "discord-wrong-server");
  const dead = await checkInvite(manifest.discord[0], fakeFetch({}));
  assert.equal(dead.problem.kind, "discord-dead");
});

test("checkInvite treats rate limits and network errors as incomplete, not as a pass", async () => {
  const api = "https://discord.com/api/v10/invites/stellardev";
  const limited = await checkInvite(
    manifest.discord[0],
    fakeFetch({ [api]: { status: 429, body: { retry_after: 5 } } }),
  );
  assert.ok(limited.error && !limited.problem);
  const offline = await checkInvite(
    manifest.discord[0],
    fakeFetch({ [api]: new Error("fetch failed") }),
  );
  assert.match(offline.error, /network error/);
});

test("collectRepos groups links by repository and skips GitHub feature paths", () => {
  const read = () =>
    "https://github.com/stellar/stellar-cli/tree/main\nhttps://github.com/Stellar/stellar-cli.\nhttps://github.com/orgs/stellar/repos\nhttps://github.com/codespaces/new";
  const repos = collectRepos(scan(["x.md"], REPO_RE, read));
  assert.deepEqual([...repos.keys()], ["stellar/stellar-cli"]);
  assert.equal(repos.get("stellar/stellar-cli").refs.length, 2);
});

test("checkRepo reports moved, archived, and missing repositories", async () => {
  const api = "https://api.github.com/repos/";
  const fetchImpl = fakeFetch({
    [`${api}stellar/soroban-cli`]: {
      body: { full_name: "stellar/stellar-cli", archived: false },
    },
    [`${api}stellar/go`]: { body: { full_name: "stellar/go", archived: true } },
    [`${api}stellar/stellar-cli`]: {
      body: { full_name: "stellar/stellar-cli", archived: false },
    },
    [`${api}stellar/limited`]: {
      status: 403,
      headers: { "x-ratelimit-remaining": "0" },
    },
  });
  assert.equal(
    (await checkRepo("stellar/soroban-cli", { fetchImpl })).problem.kind,
    "repo-moved",
  );
  assert.equal(
    (await checkRepo("stellar/go", { fetchImpl })).problem.kind,
    "repo-archived",
  );
  assert.equal(
    (await checkRepo("stellar/missing", { fetchImpl })).problem.kind,
    "repo-missing",
  );
  assert.deepEqual(await checkRepo("stellar/stellar-cli", { fetchImpl }), {
    repo: "stellar/stellar-cli",
  });
  assert.match(
    (await checkRepo("stellar/limited", { fetchImpl })).error,
    /rate limit/,
  );
});

// ---------------------------------------------------------------- report and issue

const lychee = (errors = {}, timeouts = {}) => ({
  total: 10,
  error_map: errors,
  timeout_map: timeouts,
});

test("summarizeLychee groups broken links by URL", () => {
  const s = summarizeLychee(
    lychee({
      "a.mdx": [
        { url: "https://x.test/1", status: { code: 404 }, span: { line: 3 } },
      ],
      "b.mdx": [
        { url: "https://x.test/1", status: { code: 404 }, span: { line: 9 } },
      ],
    }),
  );
  assert.equal(s.broken.length, 1);
  assert.deepEqual(s.broken[0].refs, ["a.mdx:3", "b.mdx:9"]);
});

test("buildReport is clean only when every check ran and found nothing", () => {
  const complete = { complete: true, problems: [], errors: [] };
  const clean = buildReport({
    lychee: lychee(),
    pointers: complete,
    redirects: { problems: [] },
  });
  assert.equal(clean.status, "clean");
  const missing = buildReport({
    lychee: lychee(),
    pointers: complete,
    redirects: null,
  });
  assert.equal(missing.status, "incomplete");
  const partial = buildReport({
    lychee: lychee(),
    pointers: { complete: false, problems: [], errors: ["discord: 429"] },
    redirects: { problems: [] },
  });
  assert.equal(partial.status, "incomplete");
  const empty = buildReport({
    lychee: { total: 0 },
    pointers: complete,
    redirects: { problems: [] },
  });
  assert.equal(empty.status, "incomplete");
});

test("buildReport reports findings even when a check is incomplete", () => {
  const r = buildReport({
    lychee: lychee({
      "a.mdx": [
        {
          url: "https://x.test/gone",
          status: { code: 404 },
          span: { line: 1 },
        },
      ],
    }),
    pointers: { complete: false, problems: [], errors: ["x"] },
    redirects: { problems: [] },
  });
  assert.equal(r.status, "findings");
  assert.equal(r.incomplete, true);
  assert.match(r.body, /x\.test\/gone/);
});

test("code() keeps untrusted text inside one inline code span", () => {
  assert.equal(code("a`b\nc"), "`abc`");
});

test("groupRoutes groups old routes by their first three segments", () => {
  const groups = groupRoutes([
    { path: "/p/a/2.8/x" },
    { path: "/p/a/2.8/y" },
    { path: "/docs/z" },
  ]);
  assert.deepEqual(
    groups.map(([k, v]) => [k, v.length]),
    [
      ["/p/a/2.8", 2],
      ["/docs/z", 1],
    ],
  );
});

test("decide keeps one rolling issue and never closes it on an incomplete run", () => {
  const open = { number: 1 };
  assert.equal(decide("findings", null), "create");
  assert.equal(decide("findings", open), "update");
  assert.equal(decide("clean", open), "close");
  assert.equal(decide("clean", null), "none");
  assert.equal(decide("incomplete", open), "comment");
  assert.equal(decide("incomplete", null), "none");
});
