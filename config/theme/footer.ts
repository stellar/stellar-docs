import type { FooterLinkItem } from "@docusaurus/theme-common";

const resources = {
  title: "Resources",
  items: [
    {
      label: "Developer Blog",
      href: "https://www.stellar.org/developers-blog",
    },
    {
      label: "Stellar Quest",
      href: "https://quest.stellar.org/",
    },
    {
      label: "Soroban Quest",
      href: "https://fastcheapandoutofcontrol.com/tutorial",
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/@StellarDevelopmentFoundation",
    },
    {
      label: "Twitch",
      href: "https://m.twitch.tv/stellarorg/home",
    },
    {
      html: '<a class="footer__link-item" href="/llms.txt">llms.txt</a>'
    },
  ] satisfies FooterLinkItem[],
};

const tools = {
  title: "Tools",
  items: [
    {
      label: "Explorer",
      href: "https://stellar.expert",
    },
    {
      label: "Lab",
      href: "https://lab.stellar.org",
    },
    {
      label: "Status",
      href: "https://status.stellar.org/",
    },
    {
      label: "Dashboard",
      href: "https://dashboard.stellar.org/",
    },
    {
      label: "All Tools",
      to: "/docs/tools",
    },
  ] satisfies FooterLinkItem[],
};

const community = {
  title: "Community",
  items: [
    {
      label: "Contribute to Docs",
      href: "https://github.com/stellar/stellar-docs?tab=readme-ov-file#contributing",
    },
    {
      label: "Developer Discord",
      href: "https://discord.gg/stellardev",
    },
    {
      label: "Developer Meetings",
      to: "/meetings",
    },
    {
      label: "Developer Google Group",
      href: "https://groups.google.com/g/stellar-dev",
    },
    {
      label: "Stack Exchange",
      href: "https://stellar.stackexchange.com/",
    },
    {
      label: "Stellar Community Fund",
      href: "https://communityfund.stellar.org/",
    },
  ] satisfies FooterLinkItem[],
};

const about = {
  title: "About",
  items: [
    {
      label: "About SDF",
      href: "https://stellar.org/foundation",
    },
    {
      label: "Careers",
      href: "https://stellar.org/foundation/careers",
    },
    {
      label: "Events",
      href: "https://stellar.org/events",
    },
    {
      label: "Grants & Funding",
      href: "https://stellar.org/foundation/grants-and-funding",
    },
  ] satisfies FooterLinkItem[],
};

export default {
  resources,
  tools,
  community,
  about,
};
