module.exports = {
  ...require("@stellar/prettier-config"),
  overrides: [
    {
      files: "*.mdx",
      options: {
        proseWrap: "never", // Minimize `mdx` diffs with simpler content lines
      },
    },
  ],
};