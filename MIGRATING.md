# Docusaurus habits to Mintlify habits

The docs moved from Docusaurus to [Mintlify](https://www.mintlify.com/docs) in
October 2026. This is the short "we used to do X, now do Y" list.
[CONTRIBUTING.md](CONTRIBUTING.md) has the full conventions, and the
[Mintlify docs](https://www.mintlify.com/docs) are the reference for everything
else. When in doubt, do it the way Mintlify's docs say.

## Links (the big one)

- **Was:** relative file paths with the extension,
  `[fees](../../learn/fundamentals/fees-resource-limits-metering.mdx)`. **Now:**
  root-relative URL paths with no extension,
  `[fees](/docs/learn/fundamentals/fees-resource-limits-metering)`.
- **Was:** link to a section's `README.mdx`. **Now:** link to the section's URL,
  `/docs/build`.
- **Was:** include the `.mdx` extension. **Now:** leave the extension off.
- **Was:** a broken link failed `pnpm build`. **Now:** run `pnpm check:links` to
  find broken links and anchors.
- Older pages still have relative links. Fix them when you're editing nearby;
  don't add new ones.

## Adding a page, end to end

1. Create `docs/<path>.mdx` with `title` and `description` frontmatter, and
   start the body at `##`.
2. Add `docs/<path>` to `docs.json` under `navigation`, where it belongs in the
   sidebar.
3. Link to it as `/docs/<path>`.
4. Run `pnpm format:mdx`, `pnpm check`, and `pnpm check:links`.

## Pages and navigation

- **Was:** the sidebar came from folders, `_category_.json`, and
  `sidebar_position`. **Now:** every page is listed in `docs.json` under
  `navigation`, in the order you want.
- **Was:** `README.mdx` was a folder's landing page. **Now:** those files were
  renamed `index.mdx`, and each is set as its group's `root` in `docs.json`.
- **Was:** `sidebar_label`. **Now:** `sidebarTitle`.
- **Was:** `sidebar_position`, `hide_title`, `slug`, `id`. **Now:** gone. Order
  lives in `docs.json`, and the URL is the file path.
- **Was:** a `# H1` at the top of the page. **Now:** the frontmatter `title` is
  the H1; start the body at `##`.
- Every page needs a `description`: it's used for SEO, link previews, and
  `llms.txt`.
- **Was:** `draft: true`. **Now:** list the file in `.mintignore` (not published
  at all), or use `hidden: true` (published, but unlisted and noindexed).
- A page that isn't in `docs.json` still builds and has a URL, but it isn't in
  the sidebar, search, or `llms.txt`.

## Components

- **Was:** admonitions. **Now:** callout components: `:::note` → `<Note>`,
  `:::tip` → `<Tip>`, `:::info` → `<Info>`, `:::caution`, `:::warning`, and
  `:::important` → `<Warning>`, `:::danger` → `<Danger>`.
- **Was:** `:::note Some title` or `:::note[Some title]`. **Now:** callouts have
  no title; make the first line bold instead.
- **Was:** `<CodeExample>` for multi-language code. **Now:** `<CodeGroup>`, with
  a title after each fence's language: ` ```js JavaScript `.
- **Was:** `<Tabs>` and `<TabItem value label>`, imported. **Now:** `<Tabs>` and
  `<Tab title>`, no import.
- **Was:** `groupId` to keep tabs in sync. **Now:** tabs and code groups with
  matching titles sync across the page automatically.
- **Was:** `<details><summary>`. **Now:** `<Accordion title="...">`.
- **Was:** `import` from `@site/...` or `@theme/...`. **Now:** no imports for
  built-in components; shared content lives in `/snippets/` and is imported with
  a root path.
- **Was:** custom anchor IDs with `{/* #id */}`. **Now:** `{#id}` at the end of
  the heading.
- **New rule:** leave a blank line after every opening component tag and before
  every closing one. `pnpm format:mdx` adds them, and a pre-commit hook checks.

## Images and files

- **Was:** files in `static/`, served from the site root. **Now:** files are
  served from their path in the repo. Put new images in `assets/<section>/` and
  link them as `/assets/<section>/image.png`.
- **Was:** `useBaseUrl` or MDX image imports. **Now:** plain Markdown images
  with root-relative paths.
- File paths are case-sensitive.

## URLs and redirects

- **Was:** redirects in `nginx/includes/redirects.conf`, plus `routes.txt`
  checks. **Now:** redirects are `{ "source", "destination" }` entries in
  `redirects.json`. Wildcards use `:slug*`.
- Moving or renaming a page still needs a redirect.

## Generated content

- **Was:** `pnpm api` regenerated the OpenAPI pages. **Now:** edit the specs in
  `openapi/`, run `pnpm api:bundle`, and Mintlify renders each endpoint from a
  small page with `openapi:` frontmatter.
- **New endpoint:** copy a neighboring endpoint page, change its `openapi:`
  line, and add it to `docs.json`.
- **Was:** RPC pages rendered the spec live with `<RpcMethod>`. **Now:** they're
  generated MDX. Edit `openrpc/`, then run `pnpm rpcspec:build`; ask a
  maintainer to regenerate the pages.
- **Was:** the CLI cookbook and manual were rebuilt from `stellar/stellar-cli`
  on every deploy. **Now:** they're committed copies. Fix them here _and_
  upstream until regeneration is updated.

## Local development and CI

- **Was:** `pnpm start` ran Docusaurus. **Now:** `pnpm start` runs `mint dev` at
  `http://localhost:3000`.
- **Was:** `pnpm build` as the final check. **Now:** `pnpm check` (formatting,
  padding, and `mint validate`) and `pnpm check:links`.
- **Was:** a PR preview from our own workflow. **Now:** Mintlify builds a
  preview for PRs to `main` and comments with the link. For PRs from forks, a
  maintainer approves the preview first.

## Custom code

- **Was:** React components in `src/`, and swizzling. **Now:** JSX components in
  `/snippets/`. Don't add npm packages, and use custom components sparingly.
- **Careful:** every `.js` and `.css` file in the repo loads on _every_ page.
  List any `.js` or `.css` file that isn't meant for the site in `.mintignore`.
