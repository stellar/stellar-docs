// Port of the Docusaurus wallet guide components (LanguageButtons, LanguageSpecific, WalletGuideWarn).
// The selected language is kept in the `selected_language` cookie, as in the original, and is also
// written to Mintlify's `code` preference so code groups open on the matching language tab.
// Mintlify only keeps exported components from snippet files, so each one is self-contained.

export const LanguageButtons = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const labels = { kt: "Kotlin", ts: "TypeScript", dart: "Flutter", swift: "Swift" };

  const setCookie = (lang) => {
    document.cookie = `selected_language=${lang}; SameSite=Strict; expires=Fri, 31 Dec 9999 23:59:59 GMT; Secure`;
    try {
      localStorage.setItem("code", JSON.stringify(labels[lang]));
    } catch (e) {}
    window.location.reload();
  };

  const button = (lang, light, dark, maxHeight) => (
    <span
      role="button"
      tabIndex={0}
      title={labels[lang]}
      onClick={() => setCookie(lang)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setCookie(lang)}
      style={{ cursor: "pointer", display: "inline-flex" }}
    >
      <img src={light} alt={labels[lang]} className={dark ? "block dark:hidden" : "block"} style={{ maxHeight, margin: 0 }} />
      {dark && <img src={dark} alt={labels[lang]} className="hidden dark:block" style={{ maxHeight, margin: 0 }} />}
    </span>
  );

  return (
    <div className="not-prose" style={{ gap: "1rem", display: "flex", alignItems: "center", marginBottom: "1rem" }}>
      {button("ts", "/img/wallet/ts.png", null, "1.2rem")}
      {button("kt", "/img/wallet/kt.png", "/img/wallet/kt-dark.png", "1.1rem")}
      {button("dart", "/img/wallet/flutter.png", "/img/wallet/flutter-dark.png", "1.2rem")}
      {button("swift", "/img/wallet/swift.png", "/img/wallet/swift-dark.png", "1.2rem")}
    </div>
  );
};

// Renders its children (the warning) only when the selected language is listed in WIPLangs.
export const WalletGuideWarn = ({ WIPLangs, children }) => {
  const [lang, setLang] = useState(null);

  useEffect(() => {
    const name = "selected_language=";
    const cookie = decodeURIComponent(document.cookie)
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(name));
    setLang(cookie ? cookie.substring(name.length) : "ts");
  }, []);

  const aliases = { kotlin: "kt", typescript: "ts", flutter: "dart" };
  const wip = (WIPLangs || []).map((v) => {
    const l = String(v).toLowerCase();
    return aliases[l] || l;
  });

  return lang && wip.includes(lang) ? <>{children}</> : null;
};
