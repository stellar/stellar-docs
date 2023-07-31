# Stellar Horizon OpenAPI Documentation

Contained in this directory is the OpenAPI specification for interacting with
the Horizon servers on the Stellar network.

## Contributing

First, thanks for you interest in helping out! Major kudos to you. Second, it
can be a bit difficult to figure out exactly _what_ is being rendered from
_where_ in this section of the codebase. Read on to learn all the details.

In order to make any changes or fixes, here are some steps you'll want to take.
I'll assume you're past the point of cloning and installing dependencies, and
we'll skip right to the tricky parts that are specific to this API section.

### Where to make your changes

Inside this `/openapi` directory, you'll find several `.yml` files that are used
to generate the API section of our documentation. The setup we have here will
combine all of the different `.yml` files we've got, and _bundle_ them into one
single specification file that will then be used to generate the actual
documentation pages.

Here's a quick tour of our files:

- `/openapi/main.yml`: This is the _root_ of our API specification. This file
  defines two things (among others) that I want to draw your attention to:
  1. `tags`: The tags are used to collect our various endpoints into a cohesive
     structure based on resource type.
  2. `paths`: The path definitions in this file list the endpoint URLs available
     to consume from our API. These path definitions also reference the location
     where we'll pull in more specification details from.
- `/openapi/components`: The various endpoints, schemas, parameters, variables,
  response examples, etc. that make up our openAPI specification. These are
  likely the files you'll want to edit when you are trying to make changes here.
- `/openapi/bundled.yml`: As part of the build process, all of the linked `.yml`
  files we have will be _bundled_ into one all-encompassing file that will then
  generate the API documentation that will actually be served on the docs site.
  - **Please Note**: You don't want to edit this file as you're making changes
    to our documentation. If you make changes here, and preview them locally,
    those changes _may_ be reflected in your preview. However, since the bundled
    file is intended to be a generated file, those changes will likely not last
    once someone else makes changes.
  - **Double Please Note**: While you don't want to edit this file by hand, you
    _do_ want to **commit changes to this file**.

### Bundle and generate

Once your changes are made, you'll need to do three quick things:

1. Clean up the previously generated openapi docs. It appears `redocly` has some
   trouble over-writing files that already exist (or figuring out if those files
   should be overwritten, perhaps?). So, you can use this script to clean up the
   existing generated files.

```bash
yarn api:clean
```

2. Bundle your changes into the `bundled.yml` file. We've gone over this a bit,
   so I won't repeat myself. Bring any changes you've made in the other
   components into the bundled file.

```bash
yarn api:bundle
```

If you don't have `redocly` installed, you can use `npx` to accomplish the same
thing:

```bash
npx @redocly/cli@latest bundle openapi/main.yml --output openapi/bundled.yml
```

3. Generate the new `.mdx` files that will be read and parsed for people to use.

```bash
yarn api:gen
```

4. Ooooorrr... You can use the shortcut that does all three of those at once:

```bash
yarn api
```

Now you should be ready to preview your changes locally, fiddle with them, make
a pull request, and on the list goes. You know the drill by now.

Thanks again for contributing!
