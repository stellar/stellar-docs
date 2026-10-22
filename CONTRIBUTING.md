# Contributing to the Stellar Docs

Thank you for helping make the [Stellar developer docs](https://developers.stellar.org) better! 🎉

This document covers how we work: what makes a PR easy to merge, the conventions we hold the content to, and the policies we apply to changes to the site itself. For environment setup, repository structure, and Mintlify components, see the [README](README.md).

Before diving in, please read the org-wide [Stellar Contribution Guide](https://github.com/stellar/.github/blob/master/CONTRIBUTING.md) and [Code of Conduct](https://github.com/stellar/.github/blob/master/CODE_OF_CONDUCT.md).

> [!IMPORTANT]
> The site moved from Docusaurus to [Mintlify](https://www.mintlify.com/docs) in October 2026. If you contributed before then, skim [MIGRATING.md](MIGRATING.md) first. The change you'll notice most: we now write **internal links as root-relative paths with no extension**.

## Table of Contents <!-- omit in toc -->

- [Contributing to the Stellar Docs](#contributing-to-the-stellar-docs)
  - [Ways to Contribute](#ways-to-contribute)
  - [Before You Open a PR](#before-you-open-a-pr)
  - [Development Quickstart](#development-quickstart)
  - [Content Conventions](#content-conventions)
    - [Links](#links)
    - [Pages and navigation](#pages-and-navigation)
    - [Images and files](#images-and-files)
    - [Components and code examples](#components-and-code-examples)
    - [Meeting notes](#meeting-notes)
    - [Terminology and style](#terminology-and-style)
    - [Promotional and third-party content](#promotional-and-third-party-content)
  - [Site Code and Infrastructure](#site-code-and-infrastructure)
    - [API reference pages are generated](#api-reference-pages-are-generated)
    - [CLI pages come from the `stellar-cli` repo](#cli-pages-come-from-the-stellar-cli-repo)
    - [URLs are forever](#urls-are-forever)
    - [Custom code is a last resort](#custom-code-is-a-last-resort)
    - [Tooling, editor config, and build settings](#tooling-editor-config-and-build-settings)
  - [Review Process](#review-process)

## Ways to Contribute

- **Fix something small** (typos, broken links, code errors): open a PR directly.
- **Suggest missing content or structural changes**: open an [issue](https://github.com/stellar/stellar-docs/issues) first, and search existing issues to avoid duplicates.
- **Pick up existing work**: issues labeled `good first issue` or `help wanted` are great entry points. Comment on the issue before starting so we can assign it.
- **Not sure?** Ask in the [Stellar Developer Discord](https://discord.gg/stellardev). There's even a [`#docs`](https://discord.com/channels/897514728459468821/1331985629290168351) channel!

## Before You Open a PR

These guidelines exist because they're the difference between a PR that merges in days and one that sits for months.

- **One concern per PR.** A PR should do one describable thing. "Fix the broken links on the Hubble pages" merges fast; "clean up various things across 900 files" cannot be reviewed at all. If your change is mechanical and large, propose it in an issue first so we can agree on the approach (and possibly split it) before you do the work.
- **Branch from current `main`, and don't stack.** Don't base a PR on another unmerged PR, and don't submit changes that depend on anchors, pages, or components that only exist in your other open PRs. Every PR must stand alone against `main`.
- **Discuss before building, for anything non-trivial.** New components, styling that affects the whole site, tooling or config changes, and restructured URLs: open an issue and get a nod before writing code. This protects your time more than ours.
- **Keep a reasonable number of PRs in flight.** A handful of focused, active PRs gets better review attention than dozens of parallel ones.

## Development Quickstart

We use [pnpm](https://pnpm.io/). See the [README](README.md#quick-start) for full setup.

```bash
pnpm install        # install dependencies
pnpm start          # Mintlify dev server (mint dev) at http://localhost:3000
pnpm format:mdx     # format all md/mdx content
pnpm check          # formatting, component padding, and mint validate
pnpm check:links    # broken links, anchors, redirects, and snippets
```

A husky pre-commit hook runs the formatting and padding checks; if it fails, run `pnpm format:mdx` and re-commit. CI runs the same checks plus `mint validate`. Mintlify builds a preview deployment for PRs to `main` and comments with the link; for PRs from forks, a maintainer approves the preview first.

## Content Conventions

We follow [Mintlify's conventions](https://www.mintlify.com/docs) wherever we can. The notes below cover the places people most often trip, and the few rules that are ours.

### Links

- **Internal links are root-relative URL paths with no file extension**: `[fees](/docs/learn/fundamentals/fees-resource-limits-metering#inclusion-fee)`. This is a change from what we asked for under Docusaurus. Use a path from the site root rather than a relative one (`../`), and leave off the `.mdx` or `.md` extension.
- A section's landing page is its URL: link to `/docs/build`, not to `index.mdx` or `README.mdx`.
- Run `pnpm check:links` before opening a PR. It catches broken links and anchors; nothing else does, because a broken link doesn't fail the build (for now).
- Older pages still contain relative links. Converting them is welcome when you're already editing that area; please don't add new ones.
- External links to other Stellar properties use `https://stellar.org/...` (no `www`).
- Links inside the specs in `openapi/` and `openrpc/` use full `https://developers.stellar.org/...` URLs, so external consumers of those specs can resolve them.

### Pages and navigation

- **Every page needs an entry in `docs.json` under `navigation`.** There's no autogenerated sidebar, `_category_.json`, or `sidebar_position`: the order in `docs.json` is the order in the sidebar. A page left out still builds and has a URL, but nobody will find it.
- A folder's landing page is `index.mdx`, set as its group's `root` in `docs.json`.
- Every page has frontmatter `title` and `description` (used for SEO, link previews, and the AI-facing `llms.txt`). The `title` is the page's H1, so start the body at `##`. Use `sidebarTitle` when the sidebar needs a shorter label.
- Pin anchors that other pages or external sites link to: `## SDEX {#sdex}`. Otherwise an edited heading silently breaks every link to it.
- Pages that shouldn't be published (drafts, contributor docs) go in `.mintignore`. A page that should be reachable by URL but kept out of the sidebar and search engines can use `hidden: true` instead.
- See Mintlify's [pages](https://www.mintlify.com/docs/organize/pages) and [navigation](https://www.mintlify.com/docs/organize/navigation) docs for every frontmatter and navigation option.

### Images and files

- Files are served from their path in the repo. Put new images in `assets/<section>/` and reference them with a root-relative path: `![alt text](/assets/section/image.png)`. Older images live in `img/` and are referenced via `/img/...`.
- Always include meaningful alt text.
- Paths are case-sensitive.

### Components and code examples

- Use Mintlify's [built-in components](https://www.mintlify.com/docs/components/callouts) (callouts, `<Tabs>`, `<CodeGroup>`, `<Accordion>`, `<Steps>`, `<Card>`, and so on). They need no imports.
- **Leave a blank line after every opening component tag and before every closing one.** `pnpm format:mdx` adds them, and the pre-commit hook checks.
- Callouts (`<Note>`, `<Tip>`, `<Info>`, `<Warning>`, `<Danger>`) take no title. Make the first line bold instead.
- Multi-language examples use `<CodeGroup>`: one fenced block per language, each with a title after the language (` ```js JavaScript `). Single-language examples are plain fenced code blocks. See the [README](README.md#code-groups) for an example.
- Reusable content goes in `snippets/` and is imported with a root path: `import Security from "/snippets/anchor-platform/security.mdx";`.
- In multi-part guides, show imports and shared setup in the first snippet; later snippets on the same page may assume them.
- Generic example assets are `astroDollar` (and use a second clearly named non-native asset when you need two).

### Meeting notes

- Each meeting is a page at `meetings/YYYY/MM/DD.mdx`, titled with its date (`2026-05-07`), uniformly across the series. Copy an existing note for the layout, including the video embed.
- Each note also needs an `<Update>` entry on `meetings/index.mdx` (newest first) with `rss={{ date: "YYYY-MM-DD" }}`, so the RSS feed carries the meeting date, and an entry in `docs.json` navigation.

### Terminology and style

- "Stellar network": lowercase _network_. Likewise _asset_ and _anchor_ are not capitalized.
- Write SEP and CAP references without zero-padding (for example, `SEP-1` and `CAP-1`, not `SEP-0001` and `CAP-0001`). Keep canonical filenames and URLs unchanged (for example, `sep-0001.md` and `cap-0001.md`).

### Promotional and third-party content

- **We don't accept promotional contributions.** PRs that add payment addresses, donation appeals, referral links, or marketing copy for a contributor's own product will be closed without review. This includes rewriting an existing page to center a specific project.
- **Third-party tools and services belong on the pages built for them.** Several pages exist to list ecosystem tooling and providers. Entries there are descriptive rather than promotional: what the thing does and how it works with Stellar, not why a reader should choose it. If your project clearly fits into one of these list pages, feel free to directly open a PR. If you're uncertain where or if your project fits, feel free to open an issue proposing it.

## Site Code and Infrastructure

The bar for changes to the site itself (components, styling, `docs.json`, scripts, and dependencies) is deliberately higher than for content.

### API reference pages are generated

The Horizon, Anchor Platform, and Stellar Disbursement Platform API reference pages are rendered by Mintlify from the bundled OpenAPI specs in `openapi/`. **Edit the spec sources, then run `pnpm api:bundle`**, and commit the sources and the updated bundles together. Each endpoint page is a small `.mdx` file whose frontmatter names the spec and the endpoint (`openapi: "openapi/horizon/bundled.yml GET /accounts"`); adding an endpoint means adding one of those pages and a `docs.json` entry.

Stellar RPC and the Anchor Platform's JSON-RPC API are specified in `openrpc/`. **Edit the spec sources, then run `pnpm rpcspec:build`** (or `pnpm rpcspec:validate`) and commit the sources and the rebuilt `*.openrpc.json` files together. Their method pages are generated MDX: don't hand-edit the generated part of a method page (between the `rpc-method` comments). The generator isn't in the repo yet, so ask a maintainer to regenerate the pages when a spec change affects them. See [`openrpc/README.md`](openrpc/README.md).

### CLI pages come from the `stellar-cli` repo

Three groups of pages under `docs/tools/cli/` are copies of content maintained in [`stellar/stellar-cli`](https://github.com/stellar/stellar-cli):

- **The cookbook guides** (`docs/tools/cli/cookbook/*.mdx`) come from the [`cookbook/`](https://github.com/stellar/stellar-cli/tree/main/cookbook) directory.
- **The CLI manual** (`docs/tools/cli/stellar-cli.mdx`) comes from `FULL_HELP_DOCS.md`, which is itself generated from the CLI's `--help` text (`make docs` in that repo).
- **The plugin list** (`docs/tools/cli/plugins-list.mdx`) is rebuilt by `scripts/stellar_cli_plugins.mjs` from the public GitHub repositories that carry the `stellar-cli-plugin` topic. To get a plugin listed, add that topic to its repository.

Automatic regeneration of the cookbook and manual is paused while the scripts are updated for Mintlify. Until then, the copies here are committed files: fix a mistake here _and_ in `stellar-cli`, so the next regeneration doesn't bring it back.

### URLs are forever

To the extent possible, anything that changes a page's URL needs a redirect. Redirects are entries in `redirects.json` (`{ "source": "/old/path", "destination": "/new/path" }`; wildcards use `:slug*`). If your PR moves or renames pages, add the redirects and call it out in the description. `pnpm check:links` checks that redirect destinations exist.

### Custom code is a last resort

We keep custom code on this site as small as possible, and prefer Mintlify's built-in components and settings. When something seems to need custom code, work down this list and stop at the first rung that works:

1. **Use what Mintlify provides**: a built-in component, a `docs.json` setting, or a frontmatter option.
2. **Ask Mintlify**: file a request or report a bug, so the fix happens upstream.
3. **Write a snippet component**: a `.jsx` file in `snippets/`. Don't add npm packages.
4. **Site-wide CSS or JavaScript**: only with prior discussion. Every `.css` and `.js` file in the repo loads on _every_ page, so a stray script is a site-wide change. List any `.js` or `.css` file that isn't meant for the site (repo tooling, for example) in `.mintignore`.

PRs that add site-wide styling or scripts without prior discussion in an issue will generally be closed with a request to follow this ladder.

### Tooling, editor config, and build settings

Don't commit editor configuration (`.vscode/`, etc.) or machine-specific build settings. If the build genuinely needs a change (and CI demonstrates it), propose it in an issue.

## Review Process

- You can expect a first response from a docs maintainer **within one week** (usually faster).
- PRs need maintainer approval to merge. CI must pass: formatting, component padding, and `mint validate`. A maintainer checks the Mintlify preview (for PRs from forks, after approving it). The link check runs too; it doesn't fail the build yet, but please don't add to it.
- If we ask for changes and the conversation goes quiet for a long stretch, we may close the PR to keep the queue honest. Closed is not rejected, and you're welcome to reopen when you're ready to continue.
- We close PRs that don't fit the conventions above, and we try to always say why and what a mergeable version would look like. Policy closes are about the change, never about you.

---

_This guide was seeded in part by conventions proposed in [#1044](https://github.com/stellar/stellar-docs/pull/1044). Thanks to the community members who pushed for written standards._
