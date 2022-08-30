module.exports = () => ({
  name: 'analytics-module',

  injectHtmlTags() {
    return {
      preBodyTags: [
        {
          tagName: 'script',
          innerHTML: `
            if (typeof window.ga === "function") {
              window.ga("require", "linker");
              window.ga("linker:autolink", ["www.stellar.org", "stellar.org"]);
            }
          `,
        },
      ],
    };
  },
});