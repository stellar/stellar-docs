todo:
- insert network goals prudently
- consensus on base fee info
- extrapolate variable styles

# Welcome to the Docs Contributing guidebook 🌌

An ever-expanding collection of common practices made up from community members like you!

## Why Streamline?

By agreeing on common formats for routine documentation, might we present a consistend, professional, and (most egalitarianly) approachable docs repo? That was the inspiration for starting this reference for both new and veteran contributors.

## Overarching Perspective

Let's very carefully implicate some of the ethos behind the community in an effort to distill _Balancing the World_'s humanitarian principles into something that's subtly nudging towards an empowering, creative, and inclusive readership tone.

## Code Examples

If you're technically inclined, example applications of documented functions can go a long way to further the network's understanding. Writing a quick snippet is an easy way to connect with developers, and the [local simulation](README.md#development) translates code!

```
<!-- extra line space required -->
</CodeExample>

```python
example = True
``

```js
let example = true;
``

```java
boolean example = true;
``

```go
example := true
``

```dart
bool example = true;
``

```kotlin
val example = true
``

```rust
let example = true;
``

</CodeExample>
<!-- end with seperation line -->
```

### Multiple Cases

If you're editing a detailed guide with different example segments, it is common to import packages only in the first initializatiopn of your example. After, packages, variables, and constants can be implied as the reader scrolls further into the page.

# Developed Conventions

## Referencing Base Fees

Options here are recominding `baseFee`[^abd] or explicitly 100, which [has (and more likely than not will)](https://stellar.expert/explorer/public/protocol-history) change. Part of the thinking imo is the amount of code to change when decreasing.

[^abd]: Possibly as an abstraction, similar to not repeating package imports.

## Diction, Wording

The biggest goal with standard wording is alinging common diction around a shared set of beliefs. Thus, through consistence, we might attract new developers most considerate of humanity's pressing financial challenges.

### Stellar terms

- We don't capitalize "network" in `Stellar network`
- ?? capitlize Network as standalone term ??
- Don't capitalize `asset` or `anchor`[^astrodollar]

## Cross-Referencing

When linking between pages in the docs, we use the local (`../../page.mdx#section`) resolution convention rather than raw hyperlinks to the hosting webpage. The `.mdx` extension inclusion "[does something magical](https://docusaurus.io/docs/markdown-features/links)," says Elliot. 🪄

Relevantly, if you're referencing the summary or menu page for a subsection, it's likely the file you're looking for is in `parent/README.mdx` rather than `folder.mdx`. And of course 

[^astrodollar]: In code examples, it's common practice to use astroDollars (and astroPesos if two are needed) as generic tokens.

---

# Docusarus markdown features

## Front Matter

Markdown documents have metadata at the top called [Front Matter](https://jekyllrb.com/docs/front-matter/):

```text title="my-doc.md"
// highlight-start
---
id: my-doc-id
title: My document title
description: My document description
slug: /my-custom-url
---
// highlight-end

## Markdown heading

Markdown text with [links](./hello.md)
```

## Links

Regular Markdown links are supported, using url paths or relative file paths.

```md
Let's see how to [Create a page](/create-a-page).
```

```md
Let's see how to [Create a page](./create-a-page.md).
```

**Result:** Let's see how to [Create a page](./create-a-page.md).

## Images

Regular Markdown images are supported.

You can use absolute paths to reference images in the static directory (`static/img/docusaurus.png`):

```md
![Docusaurus logo](/img/docusaurus.png)
```

![Docusaurus logo](/img/docusaurus.png)

You can reference images relative to the current file as well. This is particularly useful to colocate images close to the Markdown files using them:

```md
![Docusaurus logo](./img/docusaurus.png)
```

## Code Blocks

Markdown code blocks are supported with Syntax highlighting.

````md
```jsx title="src/components/HelloDocusaurus.js"
function HelloDocusaurus() {
  return <h1>Hello, Docusaurus!</h1>;
}
```
````

```jsx title="src/components/HelloDocusaurus.js"
function HelloDocusaurus() {
  return <h1>Hello, Docusaurus!</h1>;
}
```

## Admonitions

Docusaurus has a special syntax to create admonitions and callouts:

```md
:::tip My tip

Use this awesome feature option

:::

:::danger Take care

This action is dangerous

:::
```

:::tip My tip

Use this awesome feature option

:::

:::danger Take care

This action is dangerous

:::
