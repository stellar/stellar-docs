---
draft: true
---

# Welcome to Anchor Platform Madness <!-- omit in toc -->

Hello, and welcome to the newly versioned home of the Anchor Platform
documentation!

We're super glad to have you here, and hopefully this document will help you
understand how (and more importantly _where_) to make the needed changes to our
documentation. Let's start off with a bit of Docusaurus vocabulary, shall we?

## NOTICE! AP HAS BEEN DE-VERSIONED

The Anchor Platform documentation has been de-versioned, and we're only keeping
a "current" version of the docs from now on. So, anything in this page that
references creating a new version, updating old versions, etc. can be
disregarded.

~~However, the Anchor Platform docs _still_ remain in their own docusaurus
instance. So, information here about linking between/across instances is still
relevant. (This will not be the case forever, but for now, it is.)~~

It's no longer a separate plugin instance!! I'll update this doc soon, but for
now the finer points of linking can be summed up with:

- almost always `[use a](../../relative/link.mdx)` with the file extension,
  unless you're linking to/from a meeting notes document.

## TL;DR

- For _unreleased_ versions of Anchor Platform:
  - Add and edit docs in `/platforms/anchor-platform`
  - Update and regenerate API docs in `/openapi/anchor-platform/main-*.yaml`
- For _released_ versions of Anchor Platform:
  - Update and change docs in `/ap_versioned_docs`
  - Update and regenerate API docs in `/openapi/anchor-platform/versions/*.yaml`

Release a **new version** using the following yarn script:

```bash
# replace `3.0.0` with the needed version
VERSION=3.0.0 yarn ap:versions:new
```

> _Note:_ I think the above yarn command is currently incompatible with Windows,
> though I could be wrong.

Regenerate API docs for **already released** versions using the following yarn
script. This regenerates API docs for **all** the released versions, so you may
want to be judicious about which files you add to your commit.

```bash
yarn ap:versions:regen
```

## Table of Contents <!-- omit in toc -->

- [NOTICE! AP HAS BEEN DE-VERSIONED](#notice-ap-has-been-de-versioned)
- [TL;DR](#tldr)
- [More About Docusaurus than You Ever Wanted to Know](#more-about-docusaurus-than-you-ever-wanted-to-know)
  - [Versions Nomenclature](#versions-nomenclature)
  - [Plugins](#plugins)
  - [Instances](#instances)
  - [Links](#links)
    - [Examples](#examples)
- [Directories to Know](#directories-to-know)
  - [Directories You Already Know About](#directories-you-already-know-about)
  - [New Shiny Directories](#new-shiny-directories)
- [Making New Versions](#making-new-versions)
  - [Use Docusaurus to "Tag" a New Release](#use-docusaurus-to-tag-a-new-release)
  - [Configure the OpenAPI plugin](#configure-the-openapi-plugin)
    - [Copy the (bundled) OpenAPI Specfiles to the Versioned Directory](#copy-the-bundled-openapi-specfiles-to-the-versioned-directory)
    - [Add Configuration to the OpenAPI Plugin Instance](#add-configuration-to-the-openapi-plugin-instance)
- [Updating Old Versions](#updating-old-versions)
  - [Update Documentation Pages](#update-documentation-pages)
  - [Update API Specification](#update-api-specification)

## More About Docusaurus than You Ever Wanted to Know

I know it can feel a bit mysterious, but here's some knowledge and context to
help your understanding of what's ahead.

### Versions Nomenclature

This is how Docusaurus defines these terms, so that's what I'll use in this
document, as well.

- The **current version** refers to the version of the AP docs contained in the
  `/platforms/anchor-platform` directory. This set of docs is available at the
  `/platforms/anchor-platform/next` URL. This is the "under construction" set of
  docs.

- The **latest version** refers to the the most recently "released" set of AP
  docs. These are located in `/ap_versioned_docs` (more on that later), and is
  available at the `/platforms/anchor-platform` URL. This is the "stable" set of
  docs.

### Plugins

There are two Docusaurus plugins at play here:

1. `@docusaurus/plugin-content-docs` is the workhorse of Docusaurus. It handles
   markdown rendering, routing, etc. When you think of updating `some-file.mdx`,
   this is the plugin you're using.
2. `docusaurus-plugin-openapi-docs` is the plugin that is used to generate MDX
   pages from the OpenAPI specfiles. This plugin is capable of versioning on its
   own some some care and consideration must be taken in regards to its
   configuration.

Both of these plugin configurations have been broken out into a
`/config/anchorPlatform.config.ts` file, to ease management of them and
de-clutter somewhat the main `docusaurus.config.ts` file.

### Instances

This is where it gets a bit more "in the weeds," but I promise this part is
helpful to know. Both of the [plugins](#plugins) I mentioned above are really
just _instances_ of those two plugins. In fact each of those plugins is used
elsewhere in our docs site for Horizon, SDP, and just "regular" docs. It's not
_generally_ important to consider different plugin instances, but it _is_
**quite relevant** when we discuss links. So...

### Links

> [!WARNING]
>
> This section is outdated. Mostly ignore it for the time-being.

Most often, **especially in versioned docs**, it's important to
[link to other docs by _relative_ file paths](https://docusaurus.io/docs/versioning#link-docs-by-file-paths).
This lets Docusaurus rewrite URLs when necessary at build-time.

However, there's a **BIG EXCEPTION**! Docusaurus can only handle these links
when the source and target files are both process by the same _plugin instance_.
So, in practical terms:

- If you are linking from **and** to MDX documents _within_ the same docs plugin
  instance, use _relative file_ paths.
- If you are linking _across_ plugin instances, you **must** use _URL paths_. By
  convention, we use _absolute_ paths for this, too, to make it a little more
  obvious when this behavior is taking place.

#### Examples

This should help to make it a bit clearer.

- I want to link _from_ the MDX document
  `/platforms/anchor-platform/sep-guide/sep6/configuration.mdx` _to_ the MDX
  document
  `/platforms/anchor-platform/api-reference/platform/rpc/methods/notify_amounts_updated.mdx`:
  - We're in the same `/platforms/anchor-platform` plugin instance
  - Use a **relative file** path
  - Link to it
    `[something like this](../../api-reference/platform/rpc/methods/notify_amounts_updated.mdx)`
- I want to link _from_ the MDX document `/docs/learn/fundamentals/anchors.mdx`
  _to_ the MDX document
  `/platforms/anchor-platform/admin-guide/getting-started.mdx`
  - We're "crossing" between the `/docs` and `/platforms/anchor-platform` plugin
    instances
  - Use an **absolute URL** path
  - Link to it
    `[something like this](/platforms/anchor-platform/admin-guide/getting-started)`
    (note that there is no `.mdx` extension)
- I want to link _from_ the MDX document `/platforms/anchor-platform/README.mdx`
  _to_ the MDX document `/docs/tools/developer-tools/wallets.mdx`
  - We're "crossing" between the `/platforms/anchor-platform` and `/docs` plugin
    instances
  - Use an **absolute URL** path
  - Link to it `[something like this](/docs/tools/developer-tools/wallets)`
    (note that there is no `.mdx` extension)
- Wildcard! I want to link _from_ the MDX document
  `/platforms/anchor-platform/admin-guide/events/configuration.mdx` _to_ the MDX
  document
  `/platforms/stellar-disbursement-platform/admin-guide/60-anchor-platform-integration-points.mdx`
  - We're "crossing" between the `/platforms/anchor-platform` and
    `/platforms/stellar-disbursement-platform` plugin instances
  - Use an **absolute URL** path
  - Link to it
    `[something like this](/platforms/stellar-disbursement-platform/admin-guide/anchor-platform-integration-points)`
    (note that there is no `.mdx` extension)

> _Note:_ Replace the `/platforms/anchor-platform` plugin instance with the
> `/platforms/stellar-disbursement-platform` plugin instance in the above
> examples, and it all works pretty much identically.

Read more about links [here](https://docusaurus.io/docs/markdown-features/links)
(especially toward the bottom of the page).

## Directories to Know

There are a few directories that _all_ feed into the end product that is our
versioned AP documentation.

### Directories You Already Know About

- `/platforms/anchor-platform` This is where you are now, and traditionally has
  been the place to modify any of the markdown content that becomes our AP docs
  pages. Not much has changed here, except it does require a shift in mindset.
  **All the documentation and content located here should now be considered the
  `current` (under construction) version of AP docs.** So, as we're building for
  `v3.x` (and beyond, eventually), you'll want to be updating _content here_.
  Readers will still be able to _view_ this content before it's "released," but
  they'll be told it's the unreleased version.

  There is also a new directory here you should know about:
  - `/platforms/anchor-platform/assets` Since it's likely that the various
    images, diagrams, etc. will need to update/change from one version to
    another, we're co-locating the relevant assets in this directory. This
    allows them to be versioned as well. If you want to update a diagram or
    image for an upcoming release, you should do so here.

- `/openapi/anchor-platform` This is the same place you're probably already
  familiar with. The files have recently been renamed, but for the most part you
  want to modify `main-{platform,callbacks,custody}.yaml`, which will then be
  "bundled up" later into the bundled file that contains everything in one file.
  **The files in this directory should also be considered the `current` (under
  construction) version of AP specification docs.** So, as we're building for
  `v3.x` (and beyond, eventually), you'll want to be updating _specfiles here_.

  There is also a new directory here you should know about:
  - `/openapi/anchor-platform/versions` This directory stores a copy of the
    _bundled_ specfiles for each version that is released. The plugin we use to
    generate the API documentation for these specfiles gets configured to use
    _these_ versioned specifications for all non-`current` documentation.

- `/openrpc/src/anchor-platform` Recently, we moved the RPC specification into
  this directory so it can benefit from the same build processes and validation
  checks as the `stellar-rpc` specification. Similar to the other directories
  covered so far, any changes to these files should be considered to be on the
  `current` (under construction) version of the documentation. There's not
  (yet?) a great deal of tooling or ergonomics around updating the "old"
  versions of these specifications. The `current` version of the spec is
  generated at
  `/platforms/anchor-platform/api-reference/platform/rpc/anchor-platform.openrpc.json`.
  This means it _does_ get included in the versioning process, so any changes to
  "old" versions will likely just need to be made in those versioned specfiles
  for now (more on that in the next section).

### New Shiny Directories

- `/ap_versioned_sidebars` We can pretty well breeze right past this one. When
  you make a new version of the docs, Docusaurus stores a copy of the sidebar at
  that point in time. You shouldn't really need to bother yourself with anything
  in here.

- `/ap_versioned_docs` This is where the "released" sets of the AP docs live.
  Each time a version is released, _everything_ from within the
  `/platforms/anchor-platform` directory gets copied into a subdirectory here.
  You'll notice we already have a version `v2.8.4` here. As we release `v3.x`, a
  _new_ copy of the files will be placed here. The `latest` (stable) copy of AP
  docs are drawn from within this directory. If you come across something to fix
  or update in a released version of the docs, you'll need to update accordingly
  here.

## Making New Versions

As noted in the [TL;DR](#tldr), this process is automated with the
`VERSION=3.0.0 yarn ap:versions:new` script. However, here's what's happening
under the hood of that script.

### Use Docusaurus to "Tag" a New Release

It's actually pretty simple! Use the Docusaurus CLI to make a new release:

```bash
# `ap` is the ID of the AP `@docusaurus/plugin-content-docs` plugin instance
yarn docusaurus docs:version:ap 3.0.0
```

That makes a new copy of the docs in `/ap_versioned_docs`, and it will pretty
well "work" to get the new version displayed on the site. Any future changes to
the 3.0.0 version of the docs should be made within the `/ap_versioned_docs`
directory.

### Configure the OpenAPI plugin

We'll also want to be able to modify/update/re-generate the API documentation if
the need arises. So, we'll need to configure that
`docusaurus-plugin-openapi-docs` plugin instance accordingly.

#### Copy the (bundled) OpenAPI Specfiles to the Versioned Directory

At the moment, it's just as simple as copying the files:

```bash
cp openapi/anchor-platform/bundled-platform.yaml openapi/anchor-platform/versions/platform-3.0.0.yaml
cp openapi/anchor-platform/bundled-callbacks.yaml openapi/anchor-platform/versions/callbacks-3.0.0.yaml
cp openapi/anchor-platform/bundled-custody.yaml openapi/anchor-platform/versions/custody-3.0.0.yaml
```

> Notice how we're copying the _bundled_ file, not the _main_ file. This makes
> sure the versioned file contains everything it needs.

#### Add Configuration to the OpenAPI Plugin Instance

> _Note_: These `versions` parts of the configuration are now generated
> dynamically, using a `makeVersions()` function, so these manual config steps
> shouldn't need to be done. You _may_ want to advance/adjust the
> `anchorPlatformNextVersion` string in the config file, when you release a new
> version of docs, though.

In order to be able to use the plugin's CLI to update already-released versions,
we have to update the configuration in `/config/anchorPlatform.config.ts`. Make
a new entry in each of the specfiles' `versions` object, and copy the formatting
of the entries already there. For reference, here's what it currently looks like
for the "platform server" in `v2.8.4`:

```typescript
ap_platform: {
  specPath: "openapi/anchor-platform/bundled-platform.yaml",
  outputDir: "platforms/anchor-platform/api-reference/platform/transactions",
  hideSendButton: true,
  template: "src/template.mustache",
  version: "3.0.0",
  label: "v3.0.0",
  baseUrl: '/platforms/anchor-platform/next/api-reference/platform/transactions',
  versions: {
    "2.8.4": {
      specPath: "openapi/anchor-platform/versions/platform-2.8.4.yaml",
      outputDir: "ap_versioned_docs/version-2.8.4/api-reference/platform/transactions",
      label: "v2.8.4",
      baseUrl: "/platforms/anchor-platform/api-reference/platform/transactions"
    }
  }
}
```

## Updating Old Versions

### Update Documentation Pages

Let's say I find a misspelling in the `v2.8.4` Admin Guide documentation. Find
the relevant file in the `/ap_versioned_docs/version-2.8.4` directory, fix it
and commit. Content updates are pretty easy here.

> _Note_ Since the RPC specification is treated similar to the MDX docs, use the
> same process to make updates to the RPC specfile. For `v2.8.4`, it's located
> here:
> `/ap_versioned_docs/version-2.8.4/api-reference/platform/rpc/anchor-platform.openrpc.json`

### Update API Specification

This is a little more involved, but not much. Find and change the relevant
part(s) of the
`/openapi/anchor-platform/versions/{platform, callbacks,custody}-2.8.4.yaml`
specfile.

Then, regenerate the MDX pages:

```bash
# `ap-apis` is the ID of the AP `docusaurus-plugin-openapi-docs` plugin instance
yarn docusaurus gen-api-docs:version -p ap-apis:2.8.4
```

> _Note:_ You can use a yarn script to automatically regenerate API docs for
> **all** released versions: `yarn ap:versions:regen`. This does indeed
> regenerate all versions, so you may want to be choosy about which files you
> add to the commit.

Commit the changes, and you're off to the races.
