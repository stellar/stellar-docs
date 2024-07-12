module.exports = () => ({
  name: 'analytics-module',

  injectHtmlTags() {
    return {
      headTags: [
        {
          tagName: 'script',
          innerHTML: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-M2JLH37');
          `,
        },
        {
          tagName: 'meta',
          attributes: {
            name: 'facebook-domain-verification',
            content: 'd0o7hha86jfxvtqyxz3d9i5wtfanmy',
          },
        },
      ],
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
        {
          tagName: 'noscript',
          innerHTML: `
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M2JLH37"
          height="0" width="0" style="display:none;visibility:hidden"></iframe>
          `,
        },
      ],
    };
  },
});