# Anchor Platform Documentation Contribution Guide

This guide supplements the repository-wide
[contribution guide](../../../CONTRIBUTING.md) with the paths and generation
steps specific to Anchor Platform documentation.

## Where to Make Changes

| Content                  | Source                                                                                     | Published as                                                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Guides and landing pages | `docs/platforms/anchor-platform/**/*.mdx`                                                  | Pages, listed in `docs.json` navigation                                                                                      |
| REST API definitions     | `openapi/anchor-platform/main-platform.yaml`, `main-callbacks.yaml`, and shared YAML files | Bundled specs in `openapi/anchor-platform/bundled-*.yaml`, rendered by Mintlify on the endpoint pages under `api-reference/` |
| Platform RPC definitions | `openrpc/src/anchor-platform/**/*.json`                                                    | `docs/platforms/anchor-platform/api-reference/platform/rpc/anchor-platform.openrpc.json`                                     |
| RPC method pages         | `docs/platforms/anchor-platform/api-reference/platform/rpc/methods/*.mdx`                  | Generated MDX, built from the OpenRPC specification                                                                          |
| Sidebar structure        | The Anchor Platform entries in `docs.json` `navigation`                                    | The Anchor Platform sidebar on the site                                                                                      |

## Edit Documentation Pages

Edit prose in `docs/platforms/anchor-platform/`:

- `index.mdx` is the Anchor Platform landing page.
- `admin-guide/` contains operating and configuration guidance.
- `sep-guide/` contains guidance organized by Stellar Ecosystem Proposal (SEP).
- `api-reference/` contains a mixture of endpoint pages, generated RPC method
  pages, and manually maintained landing pages. Check the workflows below before
  editing it.

Follow the repository's
[content conventions](../../../CONTRIBUTING.md#content-conventions). In
particular, link to other documentation with a root-relative path and no file
extension:

```md
[Anchor Platform overview](/docs/platforms/anchor-platform)
[Learn about anchors](/docs/learn/fundamentals/anchors)
```

Use a path from the site root rather than a relative one (`../`), and leave off
the `.mdx` extension. Run `pnpm check:links` to catch broken links. Links
embedded in specifications under `openapi/` or `openrpc/` are the exception: use
full `https://developers.stellar.org/...` URLs so external spec consumers can
resolve them.

The sidebar comes from `docs.json`. When you add, remove, or move a page, update
its entry in `navigation`, and add a redirect to `redirects.json` if a published
URL changes.

## Generated Reference Content

### Update the OpenAPI Reference

The Platform API and callback API reference pages are rendered by Mintlify from
the bundled specs. Each endpoint page is a small `.mdx` file whose frontmatter
names the spec and the endpoint, for example:

```yaml
openapi: "openapi/anchor-platform/bundled-callbacks.yaml GET /rate"
```

1. Edit `openapi/anchor-platform/main-platform.yaml` or `main-callbacks.yaml`,
   plus `schemas.yaml` and `examples.yaml` when shared components need to
   change.
2. From the repository root, rebuild the bundled specs:

   ```bash
   pnpm api:bundle
   ```

3. If you added an endpoint, add its page (copy a neighboring one and change the
   `openapi:` line) and a `docs.json` entry. If you removed one, remove both,
   and add a redirect.
4. Review the diff. Commit the source YAML and the updated `bundled-*.yaml`
   specifications together. Investigate unrelated changes in the bundles instead
   of including them automatically.

The Redocly entry points live in `redocly.yaml`.

### Update the Platform RPC Reference

The Platform RPC specification is assembled from the JSON files in
`openrpc/src/anchor-platform/`. Don't edit the generated `*.openrpc.json` file
directly.

1. Edit the appropriate source files under `contentDescriptors/`, `examples/`,
   `methods/`, or `schemas/`.
2. Build and validate the OpenRPC specifications:

   ```bash
   pnpm rpcspec:validate
   ```

3. Commit the OpenRPC source changes and the regenerated
   `docs/platforms/anchor-platform/api-reference/platform/rpc/anchor-platform.openrpc.json`
   together.
4. The method pages under
   `docs/platforms/anchor-platform/api-reference/platform/rpc/methods/` are
   generated from the specification. Don't hand-edit the generated part of a
   page (between the `rpc-method` comments). The generator isn't in the repo
   yet, so ask a maintainer to regenerate the pages, including adding or
   removing a method's page and its `docs.json` entry.

See [`openrpc/README.md`](../../../openrpc/README.md) for the OpenRPC object
structure and `$ref` conventions.

### Validate the Changes

Run the checks relevant to your change from the repository root:

```bash
pnpm check              # formatting, component padding, and mint validate
pnpm check:links        # broken links, anchors, redirects, and snippets
pnpm api:bundle         # required after OpenAPI source changes
pnpm rpcspec:validate   # required after OpenRPC source changes
```

Before committing generated files, inspect `git diff` and make sure the change
contains its source files and only the expected generated output.
