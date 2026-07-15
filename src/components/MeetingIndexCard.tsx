import React from "react";
import Link from "@docusaurus/Link";

import { MEETINGS_INFO } from "../../meetings/schedule";

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

type Weekday = (typeof WEEKDAYS)[number];

const REFERENCE_MEETING_DATE = {
  year: 2019,
  month: 11,
  day: 4,
  hour: MEETINGS_INFO.hour,
  minute: MEETINGS_INFO.minute,
} satisfies DateParts;

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
  const fallbackMeetingTime = formatMeetingTimeFallback();

  React.useEffect(() => {
    try {
      const nextMeeting = getNextMeetingDate(new Date());
      setLocalMeetingTime(formatMeetingDisplay(nextMeeting));
    } catch {
      // Keep the fallback display if timezone calculation fails.
    }
  }, []);

  return (
    <div className="card margin-bottom--lg">
      <div className="card__body">
        <h2 className="margin-bottom--sm">Developer Meetings</h2>
        <p className="margin-bottom--sm" style={{ fontSize: "0.9rem" }}>
          These are archived discussions of open Stellar meetings. Anyone can
          attend them on {localMeetingTime ?? fallbackMeetingTime}. Join in the{" "}
          <Link
            href={MEETINGS_INFO.eventLink}
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
            style={{ color: "var(--ifm-color-white)" }}
            to="/meetings"
          >
            Recent
          </Link>
          <Link
            className="button button--primary"
            style={{ color: "var(--ifm-color-white)" }}
            to="/meetings/tags/developer"
          >
            Developer
          </Link>
          <Link
            className="button button--primary"
            style={{ color: "var(--ifm-color-white)" }}
            to="/meetings/tags/protocol"
          >
            Protocol
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatMeetingTimeFallback(): string {
  return formatMeetingSchedule(
    MEETINGS_INFO.weekday,
    formatMeetingTime(
      makeDateInTimeZone(REFERENCE_MEETING_DATE, MEETINGS_INFO.timeZone),
      MEETINGS_INFO.timeZone,
    ),
  );
}

function formatMeetingDisplay(date: Date): string {
  const formatter = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
  });
  const parts = formatter.formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value;

  if (!weekday) {
    return formatMeetingTime(date);
  }
  return formatMeetingSchedule(weekday, formatMeetingTime(date));
}

function formatMeetingSchedule(weekday: string, time: string): string {
  return `${weekday}s at ${time}`;
}

function getWeekdayIndex(weekday: string): number {
  const index = WEEKDAYS.indexOf(weekday as Weekday);

  if (index === -1) {
    throw new RangeError(`Invalid meeting weekday: ${weekday}`);
  }

  return index;
}

function formatMeetingTime(date: Date, timeZone?: string): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: timeZone ? "longGeneric" : "short",
  };

  if (timeZone) {
    options.timeZone = timeZone;
  }

  const formatter = new Intl.DateTimeFormat(undefined, options);
  return formatter.format(date);
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
  const ptParts = getTimeZoneParts(now, MEETINGS_INFO.timeZone);
  const currentIndex = getWeekdayIndex(ptParts.weekday ?? "");
  const targetIndex = getWeekdayIndex(MEETINGS_INFO.weekday);
  const rawDaysAhead = (targetIndex - currentIndex + 7) % 7;
  const hasMeetingPassedToday =
    rawDaysAhead === 0 &&
    ((ptParts.hour ?? 0) > MEETINGS_INFO.hour ||
      ((ptParts.hour ?? 0) === MEETINGS_INFO.hour &&
        (ptParts.minute ?? 0) >= MEETINGS_INFO.minute));
  const daysAhead =
    rawDaysAhead === 0 && hasMeetingPassedToday ? 7 : rawDaysAhead;
  const nextMeetingPT = {
    year: ptParts.year,
    month: ptParts.month,
    day: ptParts.day + daysAhead,
    hour: MEETINGS_INFO.hour,
    minute: MEETINGS_INFO.minute,
  };
  return makeDateInTimeZone(nextMeetingPT, MEETINGS_INFO.timeZone);
}
