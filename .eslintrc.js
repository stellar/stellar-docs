module.exports = {
  extends: ["@stellar/eslint-config"],
  rules: {
    "import/no-unresolved": 0,
    "react/jsx-filename-extension": [1, { "extensions": [".tsx", ".ts"] }]
  },
};
