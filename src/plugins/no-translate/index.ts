import type { LoadContext, Plugin } from "@docusaurus/types";

// Words and phrases that should not be translated by Google Translate.
// These are proper nouns, brand names, and technical terms that lose
// meaning when translated. Case-sensitive to avoid false positives
// (e.g. "Rust" the language vs "rust" the oxidation).
const NO_TRANSLATE_WORDS: string[] = [
  "Stellar",
  "Soroban",
  "Horizon",
  "Rust",
  "XLM",
];

export default function noTranslatePlugin(context: LoadContext): Plugin {
  const wordsJSON = JSON.stringify(NO_TRANSLATE_WORDS);

  return {
    name: 'stellar-docs-no-translate-plugin',

    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'script',
            innerHTML: `
(function() {
  var words = ${wordsJSON};
  var pattern = new RegExp("\\\\b(" + words.join("|") + ")\\\\b", "g");

  function processTextNode(node) {
    if (!pattern.test(node.nodeValue)) return;

    // Skip text inside code blocks or already-wrapped nodes
    if (node.parentElement.closest("pre, code, .notranslate")) return;

    var fragment = document.createDocumentFragment();
    var text = node.nodeValue;
    var lastIndex = 0;

    // Reset regex state since we already called .test()
    pattern.lastIndex = 0;

    var match;
    while ((match = pattern.exec(text)) !== null) {
      // Append text before the match
      if (match.index > lastIndex) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }

      // Wrap the matched word
      var span = document.createElement("span");
      span.className = "notranslate";
      span.textContent = match[0];
      fragment.appendChild(span);

      lastIndex = pattern.lastIndex;
    }

    // Append remaining text
    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    node.parentNode.replaceChild(fragment, node);
  }

  function processTree(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(processTextNode);
  }

  document.addEventListener("DOMContentLoaded", function() {
    processTree(document.body);

    // Re-process on SPA navigation (Docusaurus client-side routing)
    new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            processTree(node);
          }
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  });
})();
            `.trim(),
          },
        ],
      };
    },
  };
}
