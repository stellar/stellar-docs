/* "For agents" panel, ported from developers.stellar.org.
   Opens from any link whose href ends with "#for-agents" (see navbar.primary in docs.json).
   Styles live in style.css under "For agents panel". */
(function () {
  if (window.__forAgentsPanelLoaded) return;
  window.__forAgentsPanelLoaded = true;

  var RAVEN_MCP_URL = "https://raven.stellar.buzz/mcp";
  var SKILL_REPO_URL = "https://github.com/stellar/stellar-dev-skill";

  var npxSkillsInstall = {
    note: "Works with any tool that supports the Agent Skills standard.",
    snippets: ["npx skills add " + SKILL_REPO_URL]
  };
  var browseSkillsInstead = {
    note: "Tell your agent:",
    snippets: ["Read skills.stellar.org before you start building on Stellar."]
  };

  var TOOLS = [
    {
      id: "claude-code", label: "Claude Code",
      raven: { snippets: ['claude mcp add --transport http stellar-raven "' + RAVEN_MCP_URL + '"\n# then run /mcp -> Authenticate -> sign in in your browser'] },
      skills: {
        install: { note: "Adds the skill to your tool permanently.", snippets: ["/plugin marketplace add stellar/stellar-dev-skill", "/plugin install stellar-dev@stellar-dev"] },
        tryWithoutInstalling: browseSkillsInstead
      }
    },
    {
      id: "codex", label: "Codex",
      raven: { snippets: ['codex mcp add stellar-raven --url "' + RAVEN_MCP_URL + '"\ncodex mcp login stellar-raven  # opens your browser'] },
      skills: {
        install: { note: "Codex reads skills from ~/.codex/skills/.", snippets: ["git clone " + SKILL_REPO_URL + " ~/.codex/skills/stellar-dev-skill"] },
        tryWithoutInstalling: browseSkillsInstead
      }
    },
    {
      id: "vscode", label: "VS Code",
      raven: { snippets: ['code --add-mcp \'{"name":"stellar-raven","type":"http","url":"' + RAVEN_MCP_URL + '"}\''] },
      skills: { install: npxSkillsInstall, tryWithoutInstalling: browseSkillsInstead }
    },
    {
      id: "cursor", label: "Cursor",
      raven: {
        note: "Add to ~/.cursor/mcp.json (or .cursor/mcp.json per project). Cursor runs the OAuth sign-in on first use.",
        snippets: ['{\n  "mcpServers": {\n    "stellar-raven": { "url": "' + RAVEN_MCP_URL + '" }\n  }\n}']
      },
      skills: { install: npxSkillsInstall, tryWithoutInstalling: browseSkillsInstead }
    },
    {
      id: "claude-desktop", label: "Claude desktop",
      raven: {
        note: "Go to Settings -> Connectors -> Add custom connector, paste the endpoint, and approve the browser sign-in.",
        snippets: [RAVEN_MCP_URL]
      },
      skills: { install: npxSkillsInstall, tryWithoutInstalling: browseSkillsInstead }
    },
    {
      id: "other", label: "Other clients",
      raven: {
        note: "For clients without native remote or OAuth support, bridge with mcp-remote.",
        snippets: ['{\n  "mcpServers": {\n    "stellar-raven": {\n      "command": "npx",\n      "args": [\n        "-y",\n        "mcp-remote@latest",\n        "' + RAVEN_MCP_URL + '",\n        "--transport",\n        "http-only"\n      ]\n    }\n  }\n}'],
        links: [{ label: "mcp-remote", href: "https://github.com/geelen/mcp-remote" }]
      },
      skills: { install: npxSkillsInstall, tryWithoutInstalling: browseSkillsInstead }
    }
  ];

  var SECTIONS = {
    raven: {
      title: "Raven MCP Server",
      description: "Connect your AI agent to Stellar data and tooling.",
      guide: { label: "Full guide", href: "/docs/build/building-with-ai" },
      links: [
        { label: "Try in chat", href: "https://raven.stellar.buzz/playground" },
        { label: "View source", href: "https://github.com/stellar-experimental/stellar-raven" }
      ]
    },
    skills: {
      title: "Stellar Skills",
      description: "Stellar context for your agent before it writes code.",
      home: { label: "skills.stellar.org", href: "https://skills.stellar.org/" },
      modes: [{ id: "install", label: "Install" }, { id: "tryWithoutInstalling", label: "Try without installing" }]
    },
    llmsTxt: { title: "llms.txt", href: "/llms.txt", description: "Machine-readable overview of the Stellar docs." }
  };

  var state = { toolId: TOOLS[0].id, mode: "install" };
  var panel = null;
  var returnFocus = null;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function link(l, external) {
    var ext = external || /^https?:/.test(l.href);
    return '<a class="fa-link" href="' + esc(l.href) + '"' + (ext ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" +
      esc(l.label) + ' <span aria-hidden="true">&rarr;</span></a>';
  }

  function copyBlock(code) {
    return '<div class="fa-copy"><pre class="fa-code">' + esc(code) + "</pre>" +
      '<button type="button" class="fa-copy-btn" aria-label="Copy command" data-copy="' + esc(code) + '"></button></div>';
  }

  function tool() {
    for (var i = 0; i < TOOLS.length; i++) if (TOOLS[i].id === state.toolId) return TOOLS[i];
    return TOOLS[0];
  }

  function render() {
    var t = tool();
    var raven = t.raven;
    var skills = t.skills[state.mode];
    var html = "";

    html += '<div class="fa-header"><span class="fa-title" id="fa-panel-title">Use Stellar with AI</span>' +
      '<button type="button" class="fa-close" aria-label="Close"></button></div>';
    html += '<div class="fa-body">';

    html += '<div class="fa-picker"><span class="fa-picker-label">Your tool</span><div class="fa-pills" role="radiogroup">';
    TOOLS.forEach(function (x) {
      html += '<button type="button" role="radio" class="fa-pill' + (x.id === state.toolId ? " is-active" : "") +
        '" aria-checked="' + (x.id === state.toolId) + '" data-tool="' + x.id + '">' + esc(x.label) + "</button>";
    });
    html += "</div></div>";

    html += '<section class="fa-section"><div class="fa-section-head"><h3 class="fa-section-title">' + esc(SECTIONS.raven.title) + "</h3>" +
      link(SECTIONS.raven.guide) + "</div><p class=\"fa-desc\">" + esc(SECTIONS.raven.description) + "</p>";
    if (raven.note) html += '<p class="fa-note">' + esc(raven.note) + "</p>";
    raven.snippets.forEach(function (c) { html += copyBlock(c); });
    html += '<div class="fa-links">';
    SECTIONS.raven.links.forEach(function (l) { html += link(l, true); });
    (raven.links || []).forEach(function (l) { html += link(l, true); });
    html += "</div></section>";

    html += '<section class="fa-section"><div class="fa-section-head"><h3 class="fa-section-title">' + esc(SECTIONS.skills.title) + "</h3>" +
      link(SECTIONS.skills.home, true) + "</div><p class=\"fa-desc\">" + esc(SECTIONS.skills.description) + "</p>";
    html += '<div class="fa-pills" role="group">';
    SECTIONS.skills.modes.forEach(function (m) {
      html += '<button type="button" class="fa-pill' + (m.id === state.mode ? " is-active" : "") +
        '" aria-pressed="' + (m.id === state.mode) + '" data-mode="' + m.id + '">' + esc(m.label) + "</button>";
    });
    html += "</div>";
    if (skills.note) html += '<p class="fa-note">' + esc(skills.note) + "</p>";
    skills.snippets.forEach(function (c) { html += copyBlock(c); });
    html += "</section>";

    html += '<section class="fa-section">' + link({ label: SECTIONS.llmsTxt.title, href: SECTIONS.llmsTxt.href }) +
      '<p class="fa-desc">' + esc(SECTIONS.llmsTxt.description) + "</p></section>";

    html += "</div>";
    panel.innerHTML = html;
  }

  function refocus(selector) {
    var el = panel.querySelector(selector);
    if (el) el.focus();
  }

  function ensurePanel() {
    if (panel) return panel;
    panel = document.createElement("div");
    panel.id = "for-agents-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-labelledby", "fa-panel-title");
    panel.setAttribute("aria-modal", "true");
    panel.hidden = true;
    document.body.appendChild(panel);

    panel.addEventListener("click", function (e) {
      var el = e.target.closest("button");
      if (!el) return;
      if (el.classList.contains("fa-close")) return close();
      // render() replaces the panel's contents, so put focus back on the same pill.
      if (el.dataset.tool) { state.toolId = el.dataset.tool; render(); refocus('[data-tool="' + state.toolId + '"]'); return; }
      if (el.dataset.mode) { state.mode = el.dataset.mode; render(); refocus('[data-mode="' + state.mode + '"]'); return; }
      if (el.dataset.copy !== undefined) {
        navigator.clipboard.writeText(el.dataset.copy).then(function () {
          el.classList.add("is-copied");
          setTimeout(function () { el.classList.remove("is-copied"); }, 2000);
        }).catch(function (err) {
          console.error("For agents panel: copy failed", err);
        });
      }
    });
    render();
    return panel;
  }

  function open() {
    returnFocus = document.activeElement;
    ensurePanel();
    panel.hidden = false;
    document.body.classList.add("fa-open");
    var first = panel.querySelector(".fa-close");
    if (first) first.focus();
  }

  function close() {
    if (!panel) return;
    panel.hidden = true;
    document.body.classList.remove("fa-open");
    if (returnFocus && returnFocus.focus) returnFocus.focus();
    returnFocus = null;
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]");
    if (a && /#for-agents$/.test(a.getAttribute("href"))) {
      e.preventDefault();
      panel && !panel.hidden ? close() : open();
      return;
    }
    if (panel && !panel.hidden && e.composedPath().indexOf(panel) === -1) close();
  });

  document.addEventListener("keydown", function (e) {
    if (!panel || panel.hidden) return;
    if (e.key === "Escape") return close();
    // Keep Tab focus inside the open panel.
    if (e.key !== "Tab") return;
    var items = panel.querySelectorAll("button, a[href]");
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();
