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
const PLAYLIST_URL =
  "https://www.youtube.com/playlist?list=PLmr3tp_7-7Gg5IAsJ0VlgfMoh-aTmbQmh";

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
        <h1 className="margin-bottom--sm">Stellar Meetings</h1>
        <p className="margin-bottom--sm">
          Weekly developer and protocol calls keep the community aligned on
          roadmap progress, new CAP proposals, and ecosystem updates. Each post
          below includes notes and the recording, but you can also binge the full
          series on YouTube.
        </p>
        <Link
          className="button button--primary"
          href={PLAYLIST_URL}
          target="_blank"
          rel="noreferrer noopener"
        >
          Watch the YouTube playlist
        </Link>
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
