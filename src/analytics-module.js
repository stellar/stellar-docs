module.exports = function (context, options) {
  return {
    name: 'analytics-module',

    injectHtmlTags({content}) {
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
  };
};