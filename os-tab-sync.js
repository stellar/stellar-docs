
(function () {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  var SESSION_OVERRIDE_KEY = "osTabSync:userChose";
  var GROUP_DONE_ATTR = "data-os-tab-defaulted";

  // Ordered patterns per OS category. Within a category, earlier patterns win,
  // so a Windows visitor prefers a "PowerShell" tab over a generic "Windows"
  // one only where that ordering is intended — tweak freely.
  var OS_LABEL_PATTERNS = {
    windows: [/power\s*shell/i, /windows/i, /\bwin(32|64|dows)?\b/i, /\bwsl\b/i],
    mac: [/mac\s*os/i, /\bmac\b/i, /os\s*x|osx/i, /darwin/i, /\bzsh\b/i],
    linux: [/linux/i, /ubuntu|debian|fedora|arch/i, /\bbash\b/i, /x11/i],
  };

  // Detect the visitor's OS category from UA-CH (preferred) or the UA string.
  function detectOS() {
    var platform = "";
    try {
      if (navigator.userAgentData && navigator.userAgentData.platform) {
        platform = navigator.userAgentData.platform;
      }
    } catch (e) {
      /* UA-CH not available — fall through to UA string */
    }
    var haystack = (
      platform +
      " " +
      (navigator.platform || "") +
      " " +
      (navigator.userAgent || "")
    ).toLowerCase();

    // Order matters: iOS/iPadOS report "like Mac OS X", so check Windows first,
    // then Mac, then Linux. Mobile is intentionally treated loosely.
    if (/windows|win32|win64|\bwin\b/.test(haystack)) return "windows";
    if (/mac|iphone|ipad|ipod|darwin/.test(haystack)) return "mac";
    if (/linux|x11|cros|android/.test(haystack)) return "linux";
    return null;
  }

  function labelOf(tab) {
    return (tab.textContent || "").trim();
  }

  // Which OS category does a tab label belong to? Returns the first matching
  // category (object key order: windows, mac, linux). Combined labels like
  // "macOS/Linux" resolve to the first category that matches (mac).
  function categoryOfLabel(label) {
    for (var cat in OS_LABEL_PATTERNS) {
      if (!Object.prototype.hasOwnProperty.call(OS_LABEL_PATTERNS, cat))
        continue;
      var patterns = OS_LABEL_PATTERNS[cat];
      for (var i = 0; i < patterns.length; i++) {
        if (patterns[i].test(label)) return cat;
      }
    }
    return null;
  }

  // Find the best-matching tab in a group for an OS category, honoring the
  // intra-category priority order.
  function pickTabForCategory(tabs, category) {
    var patterns = OS_LABEL_PATTERNS[category];
    if (!patterns) return null;
    for (var p = 0; p < patterns.length; p++) {
      for (var t = 0; t < tabs.length; t++) {
        if (patterns[p].test(labelOf(tabs[t]))) return tabs[t];
      }
    }
    return null;
  }

  function tabsInGroup(tablist) {
    return Array.prototype.slice.call(
      tablist.querySelectorAll('[role="tab"]')
    );
  }

  function isSelected(tab) {
    return tab.getAttribute("aria-selected") === "true";
  }

  var programmaticClick = false;
  function selectTab(tab) {
    if (!tab || isSelected(tab)) return;
    programmaticClick = true;
    try {
      tab.click(); // real click -> Mintlify's own onClick (sync + persist) runs
    } finally {
      programmaticClick = false;
    }
  }

  function userHasOverridden() {
    try {
      return sessionStorage.getItem(SESSION_OVERRIDE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function markUserOverride() {
    try {
      sessionStorage.setItem(SESSION_OVERRIDE_KEY, "1");
    } catch (e) {
      /* storage blocked — in-memory flag below still protects this page */
    }
  }

  // Apply the OS default to any tab groups we have not touched yet.
  function applyOsDefaults(os) {
    if (!os || userHasOverridden()) return;
    // A deep link to a specific tab/section should win over the OS default.
    if (window.location.hash && window.location.hash.length > 1) return;

    var tablists = document.querySelectorAll('[role="tablist"]');
    for (var i = 0; i < tablists.length; i++) {
      var tablist = tablists[i];
      if (tablist.getAttribute(GROUP_DONE_ATTR) === "1") continue;
      var tabs = tabsInGroup(tablist);
      if (!tabs.length) continue;
      var target = pickTabForCategory(tabs, os);
      tablist.setAttribute(GROUP_DONE_ATTR, "1"); // mark regardless of match
      if (target) selectTab(target);
    }
  }

  // Cross-group sync by OS category (looser than Mintlify's exact-label sync).
  function syncByCategory(sourceTab) {
    var category = categoryOfLabel(labelOf(sourceTab));
    if (!category) return;
    var tablists = document.querySelectorAll('[role="tablist"]');
    for (var i = 0; i < tablists.length; i++) {
      var tabs = tabsInGroup(tablists[i]);
      if (tabs.indexOf(sourceTab) !== -1) continue; // skip the source group
      var match = pickTabForCategory(tabs, category);
      if (match) selectTab(match);
    }
  }

  // One delegated listener handles manual clicks for both features.
  document.addEventListener(
    "click",
    function (event) {
      var tab = event.target && event.target.closest
        ? event.target.closest('[role="tab"]')
        : null;
      if (!tab) return;

      if (programmaticClick) return; // ignore clicks we dispatched ourselves

      // Genuine user interaction: stop auto-defaulting and propagate by category.
      markUserOverride();
      // Let Mintlify's own handler run first, then widen the sync by category.
      window.setTimeout(function () {
        syncByCategory(tab);
      }, 0);
    },
    true
  );

  var detectedOS = detectOS();

  function run() {
    applyOsDefaults(detectedOS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  // Mintlify is a single-page app: route changes swap <Tabs> in without a full
  // reload. Watch for newly mounted tab groups and default them too (until the
  // user overrides).
  var observer = new MutationObserver(function () {
    if (userHasOverridden() || !detectedOS) return;
    if (window.location.hash && window.location.hash.length > 1) return;
    applyOsDefaults(detectedOS);
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
