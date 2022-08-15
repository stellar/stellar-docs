module.exports = function (context, options) {
  return {
    name: 'analytics-module',

    injectHtmlTags({content}) {
      return {
        preBodyTags: [
          {
            tagName: 'script',
            innerHTML: `
              console.log('hello world');

              if (typeof window.ga === "function") {
                console.log('it worked')

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