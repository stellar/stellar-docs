
(function () {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  // Only these pages get a linked h1, matching developers.stellar.org.
  var TITLE_LINKS = {
    "/docs/tools/lab/saved/keypairs": "https://lab.stellar.org/account/saved",
    "/docs/tools/lab/saved/transactions": "https://lab.stellar.org/transaction/saved",
    "/docs/tools/lab/saved/requests": "https://lab.stellar.org/endpoints/saved",
  };
  var LINKED_ATTR = "data-lab-title-link";

  function currentHref() {
    var path = window.location.pathname.replace(/\/+$/, "");
    return Object.prototype.hasOwnProperty.call(TITLE_LINKS, path)
      ? TITLE_LINKS[path]
      : null;
  }

  function titleEl() {
    return document.getElementById("page-title") || document.querySelector("header h1");
  }

  // Mintlify reuses the h1 across client-side navigations, so we never wrap its
  // React-owned text in an <a>; we only toggle attributes, and strip them on
  // any page that is not in TITLE_LINKS.
  function sync() {
    var href = currentHref();
    var linked = document.querySelectorAll("[" + LINKED_ATTR + "]");
    for (var i = 0; i < linked.length; i++) {
      if (!href || linked[i] !== titleEl()) {
        linked[i].removeAttribute(LINKED_ATTR);
        linked[i].removeAttribute("role");
        linked[i].removeAttribute("tabindex");
        linked[i].removeAttribute("title");
      }
    }
    if (!href) return;
    var h1 = titleEl();
    if (!h1 || h1.getAttribute(LINKED_ATTR) === href) return;
    h1.setAttribute(LINKED_ATTR, href);
    h1.setAttribute("role", "link");
    h1.setAttribute("tabindex", "0");
    h1.setAttribute("title", "Open in Stellar Lab");
  }

  function open(event) {
    var h1 = event.target && event.target.closest
      ? event.target.closest("[" + LINKED_ATTR + "]")
      : null;
    if (!h1) return;
    // Re-check the route at click time so a stale attribute can never fire.
    var href = currentHref();
    if (!href || h1.getAttribute(LINKED_ATTR) !== href) return;
    if (event.type === "keydown" && event.key !== "Enter") return;
    event.preventDefault();
    window.open(href, "_blank", "noopener,noreferrer");
  }

  document.addEventListener("click", open);
  document.addEventListener("keydown", open);

  var style = document.createElement("style");
  style.textContent =
    "[" + LINKED_ATTR + "]{cursor:pointer}" +
    "[" + LINKED_ATTR + "]:hover,[" + LINKED_ATTR + "]:focus-visible{text-decoration:underline}";
  document.head.appendChild(style);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", sync);
  } else {
    sync();
  }

  new MutationObserver(sync).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
