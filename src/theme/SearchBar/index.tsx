import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import { DocSearch } from "@docsearch/react";
import "@docsearch/css";

type Hit = { url: string; [k: string]: any };

function derivePath(url: string, baseUrl = "/"): string {
  const { pathname } = new URL(url);
  let path = pathname.startsWith(baseUrl)
    ? pathname.slice(baseUrl.length - 1)
    : pathname;
  path = path.replace(/index\.html$/i, "");
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path || "/";
}

function prettyPath(path: string): string {
  return path.split("/").filter(Boolean).join(" › ");
}

export default function SearchBar() {
  const { siteConfig } = useDocusaurusContext();
  const themeConfig = (siteConfig?.themeConfig as any) || {};
  const algolia = themeConfig.algolia || {};
  const baseUrl: string = (siteConfig as any)?.baseUrl || "/";
  const searchPagePath: string | undefined = algolia.searchPagePath;

  if (!algolia?.appId || !algolia?.apiKey || !algolia?.indexName) return null;

  return (
    <DocSearch
      {...algolia}
      transformItems={(items: Hit[]) =>
        items.map((item) => {
          const path = derivePath(item.url, baseUrl);
          return { ...item, __path: path, __prettyPath: prettyPath(path) };
        })
      }
      hitComponent={({ hit, children }: { hit: Hit; children: React.ReactNode }) => (
        <a href={hit.url} className="DocSearch-Hit">
          <div className="DocSearch-Hit-Container">
            <div className="DocSearch-Hit-content">
              <div className="DocSearch-Hit-title">{children}</div>
              <div className="DocSearch-Hit-path">{hit.__prettyPath || hit.__path}</div>
            </div>
          </div>
        </a>
      )}
      // 🔽 Restores the "See all results" footer
      resultsFooterComponent={({ state, onClose }) => {
        if (!searchPagePath) return null;
        const q = encodeURIComponent(state.query || "");
        const to = `${baseUrl.replace(/\/$/, "")}/${searchPagePath}?q=${q}`;
        return (
          <div className="DocSearch-Footer-SeeAll">
            <Link to={to} onClick={onClose} className="DocSearch-SeeAllLink">
              See all search results
            </Link>
          </div>
        );
      }}
    />
  );
}
