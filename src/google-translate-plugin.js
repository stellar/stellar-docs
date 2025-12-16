module.exports = function googleTranslatePlugin(context, options) {
    return {
        name: 'google-translate-init',
        injectHtmlTags() {
            return {
                headTags: [
                    {
                        tagName: 'script',
                        innerHTML: `
              function googleTranslateElementInit() {}
              
              // Add notranslate class to hash-links so Google Translate ignores them
              // This prevents header text from being merged with anchor links
              function markHashLinksAsNotTranslate() {
                document.querySelectorAll('.hash-link, a[href^="#"]').forEach(function(el) {
                  el.classList.add('notranslate');
                  el.setAttribute('translate', 'no');
                });
              }
              
              // Run on initial page load
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', markHashLinksAsNotTranslate);
              } else {
                markHashLinksAsNotTranslate();
              }
              
              // Run on SPA navigation (Docusaurus uses client-side routing)
              // Use MutationObserver to detect when new content is added
              var observer = new MutationObserver(function(mutations) {
                markHashLinksAsNotTranslate();
              });
              
              // Start observing when DOM is ready
              function startObserving() {
                var target = document.querySelector('main') || document.body;
                observer.observe(target, { childList: true, subtree: true });
              }
              
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', startObserving);
              } else {
                startObserving();
              }
            `,
                    },
                ],
            };
        },
    };
};
