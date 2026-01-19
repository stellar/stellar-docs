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
const MEETING_TIMEZONE = "America/Los_Angeles";
const MEETING_WEEKDAY = "Thursday";
const MEETING_HOUR = 13;
const MEETING_MIN = 0;

type DateParts = {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
  weekday?: string;
};

function getTimeZoneOffset(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(date);
  const values = parts.reduce<Record<string, number>>((acc, part) => {
    if (part.type !== "literal") {
      acc[part.type] = Number(part.value);
    }
    return acc;
  }, {});
  const asUtc = Date.UTC(
    values.year,
    values.month - 1,
    values.day,
    values.hour,
    values.minute,
    values.second,
  );
  return (asUtc - date.getTime()) / 60000;
}

function makeDateInTimeZone(parts: DateParts, timeZone: string): Date {
  const utcDate = new Date(
    Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour ?? 0,
      parts.minute ?? 0,
      parts.second ?? 0,
    ),
  );
  const offsetMinutes = getTimeZoneOffset(utcDate, timeZone);
  return new Date(utcDate.getTime() - offsetMinutes * 60000);
}

function getTimeZoneParts(date: Date, timeZone: string): DateParts {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(date);
  const values = parts.reduce<Record<string, string>>((acc, part) => {
    if (part.type !== "literal") {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
    weekday: values.weekday,
  };
}

function getNextMeetingDate(now: Date): Date {
  const laParts = getTimeZoneParts(now, MEETING_TIMEZONE);
  const weekdayOrder = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentIndex = weekdayOrder.indexOf(laParts.weekday ?? "");
  const targetIndex = weekdayOrder.indexOf(MEETING_WEEKDAY);
  const daysAhead = (targetIndex - currentIndex + 7) % 7 || 7;
  const nextMeetingLa = {
    year: laParts.year,
    month: laParts.month,
    day: laParts.day + daysAhead,
    hour: MEETING_HOUR,
    minute: MEETING_MIN,
  };
  return makeDateInTimeZone(nextMeetingLa, MEETING_TIMEZONE);
}

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
  const [localMeetingTime, setLocalMeetingTime] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    const nextMeeting = getNextMeetingDate(new Date());
    const formatter = new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      hour: "numeric",
      minute: "2-digit",
    });
    const parts = formatter.formatToParts(nextMeeting);
    const weekday = parts.find((part) => part.type === "weekday")?.value;
    const time = formatter.format(nextMeeting).replace(weekday ?? "", "").trim();
    const formatted = weekday ? `${weekday}s at ${time}` : formatter.format(nextMeeting);
    setLocalMeetingTime(formatted);
  }, []);

  return (
    <div className="card margin-bottom--lg">
      <div className="card__body">
        <h2 className="margin-bottom--sm">Developer Meetings</h2>
        <p className="margin-bottom--sm" style={{ fontSize: "0.9rem" }}>
          Watch key discussions in this archive of open Stellar meetings and reference notes. And feel free to join weekly on{" "}
          {localMeetingTime
            ? `${localMeetingTime} local time`
            : `1:00 PM pacific time`}{" "}
          in{" "}
          <Link
            href="https://discord.gg/b9zfSytphY?event=1394227773765062677"
            target="_blank"
            rel="noreferrer noopener"
          >
            Discord events
          </Link>
          . You can also subscribe to email notifications in the developer{" "}
          <Link
            href="https://groups.google.com/g/stellar-dev/search?q=subject%3Ameeting"
            target="_blank"
            rel="noreferrer noopener"
          >
            mailing list
          </Link>
          .
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <Link
            className="button button--primary"
            style={{ color: "#fff" }}
            to="/meetings/tags/developer"
          >
            Recent
          </Link>
          <Link
            className="button button--primary"
            style={{ color: "#fff" }}
            to="/meetings/tags/soroban"
          >
            Soroban
          </Link>
          <Link
            className="button button--primary"
            style={{ color: "#fff" }}
            to="/meetings/tags/legacy"
          >
            Legacy
          </Link>
          <Link
            className="button button--primary"
            style={{ color: "#fff" }}
            to="/meetings/tags/community"
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
