module.exports = function (context, options) {
  return {
    name: 'analytics-module',

    injectHtmlTags({content}) {
      return {
        preBodyTags: [
          {
            tagName: 'script',
            attributes: {
              charset: 'utf-8',
              src: '/docs/assets/ga.js',
            },
          },
        ],
      };
    },
  };
};