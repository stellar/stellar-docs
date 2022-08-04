module.exports = {
  ...require("@stellar/prettier-config"),
  // This is mostly content, and prose wrap has a way of exploding markdown
  // diffs. Override the default for a better experience.
  overrides: [
    {
      files: "*.mdx",
      options: {
        proseWrap: "never",
      },
    },
  ],
};