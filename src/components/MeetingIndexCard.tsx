import React from "react";
import Link from "@docusaurus/Link";

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

export default function MeetingIndexCard(): React.ReactElement {
  const [localMeetingTime, setLocalMeetingTime] = React.useState<string | null>(
    null,
  );
  const fallbackMeetingTime = React.useMemo(
    () => formatMeetingTimeFallback(),
    [],
  );

  React.useEffect(() => {
    try {
      const nextMeeting = getNextMeetingDate(new Date());
      setLocalMeetingTime(formatMeetingDisplay(nextMeeting));
    } catch {
      // use `fallbackMeetingTime`
    }
  }, [fallbackMeetingTime]);

  return (
    <div className="card margin-bottom--lg">
      <div className="card__body">
        <h2 className="margin-bottom--sm">Developer Meetings</h2>
        <p className="margin-bottom--sm" style={{ fontSize: "0.9rem" }}>
          These are archived discussions of open Stellar meetings. Anyone can
          attend them on {localMeetingTime ?? fallbackMeetingTime}. Join in the{" "}
          <Link
            href="https://discord.gg/b9zfSytphY?event=1394227773765062677"
            target="_blank"
            rel="noreferrer noopener"
          >
            developer Discord
          </Link>
          , and subscribe to the{" "}
          <Link
            href="https://groups.google.com/g/stellar-dev/search?q=subject%3Ameeting"
            target="_blank"
            rel="noreferrer noopener"
          >
            mailing list
          </Link>{" "}
          for reminders.
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

function formatMeetingTimeFallback(): string {
  const currentYear = new Date().getFullYear();
  const date = makeDateInTimeZone(
    {
      year: currentYear,
      month: 1,
      day: 1,
      hour: MEETING_HOUR,
      minute: MEETING_MIN,
    },
    MEETING_TIMEZONE,
  );
  return formatMeetingDisplay(date);
}

function formatMeetingDisplay(date: Date): string {
  const formatter = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZone: MEETING_TIMEZONE,
    timeZoneName: "longGeneric",
  });
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: MEETING_TIMEZONE,
  });
  const parts = formatter.formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const timeZoneName = parts.find((part) => part.type === "timeZoneName")?.value;
  const time = timeFormatter.format(date);
  if (!weekday) {
    return `${time}${timeZoneName ? ` ${timeZoneName}` : ""}`;
  }
  return `${weekday}s at ${time}${timeZoneName ? ` ${timeZoneName}` : ""}`;
}

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
  const ptParts = getTimeZoneParts(now, MEETING_TIMEZONE);
  const weekdayOrder = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentIndex = weekdayOrder.indexOf(ptParts.weekday ?? "");
  const targetIndex = weekdayOrder.indexOf(MEETING_WEEKDAY);
  const daysAhead = (targetIndex - currentIndex + 7) % 7 || 7;
  const nextMeetingPT = {
    year: ptParts.year,
    month: ptParts.month,
    day: ptParts.day + daysAhead,
    hour: MEETING_HOUR,
    minute: MEETING_MIN,
  };
  return makeDateInTimeZone(nextMeetingPT, MEETING_TIMEZONE);
}
