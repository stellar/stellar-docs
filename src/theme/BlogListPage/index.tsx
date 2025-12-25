import React, { type ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import BlogLayout from "@theme/BlogLayout";
import BlogListPaginator from "@theme/BlogListPaginator";
import SearchMetadata from "@theme/SearchMetadata";
import type { Props } from "@theme/BlogListPage";
import BlogPostItems from "@theme/BlogPostItems";
import BlogListPageStructuredData from "@theme/BlogListPage/StructuredData";

const MEETING_ROUTE = "/meetings";

function BlogListPageMetadata(props: Props): ReactNode {
  const { metadata } = props;
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { blogDescription, blogTitle, permalink } = metadata;
  const isBlogOnlyMode = permalink === "/";
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function MeetingSeriesIntro(): ReactNode {
  return (
    <div className="card margin-bottom--lg">
      <div className="card__body">
        <h2 className="margin-bottom--sm">Developer Meetings</h2>
        <p className="margin-bottom--sm" style={{ fontSize: "0.9rem" }}>
          Welcome to the archive of public Stellar meetings. This section collects recordings and notes so you can watch key discussions and follow along at your own pace. Each post below includes notes and the recording, but you can also binge the full series on YouTube. The buttons below go to these lists if you are interested in the "why" behind Stellar’s core design choices (maintained for the SDF).
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <Link
            className="button button--primary"
            style={{ color: "#fff" }}
            href="https://www.youtube.com/playlist?list=PLmr3tp_7-7Gg5IAsJ0VlgfMoh-aTmbQmh"
            target="_blank"
            rel="noreferrer noopener"
          >
            Recent
          </Link>
          <Link
            className="button button--primary"
            style={{ color: "#fff" }}
            href="https://www.youtube.com/playlist?list=PLmr3tp_7-7GiPm9649cKh0Ythi2l5wj0a"
            target="_blank"
            rel="noreferrer noopener"
          >
            Soroban
          </Link>
          <Link
            className="button button--primary"
            style={{ color: "#fff" }}
            href="https://www.youtube.com/playlist?list=PLmr3tp_7-7Gj9cTR5ieSaRHxiA2zItFyx"
            target="_blank"
            rel="noreferrer noopener"
          >
            Legacy
          </Link>
          <Link
            className="button button--primary"
            style={{ color: "#fff" }}
            href="/meetings/tags/community"
          >
            Community
          </Link>
        </div>
      </div>
    </div>
  );
}

function BlogListPageContent(props: Props): ReactNode {
  const { metadata, items, sidebar } = props;
  const showMeetingIntro = metadata.permalink === MEETING_ROUTE;
  return (
    <BlogLayout sidebar={sidebar}>
      {showMeetingIntro && <MeetingSeriesIntro />}
      <BlogPostItems items={items} />
      <BlogListPaginator metadata={metadata} />
    </BlogLayout>
  );
}

export default function BlogListPage(props: Props): ReactNode {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}
    >
      <BlogListPageMetadata {...props} />
      <BlogListPageStructuredData {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
