import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import Link from "@docusaurus/Link";

import { MEETINGS_INFO } from "../../meetings/schedule";
import styles from "./styles.module.scss";

const WEEKDAY_ORDER = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export default function MeetingsIntro(): React.ReactElement {
  return (
    <div className="card margin-bottom--lg">
      <div className="card__body">
        <h2 className="margin-bottom--sm">Developer Meetings</h2>
        <p className={`margin-bottom--sm ${styles.description}`}>
          These are archived discussions of open Stellar meetings. Anyone can
          attend
          <BrowserOnly fallback={null}>
            {() => <> them on {getLocalMeetingSchedule()}</>}
          </BrowserOnly>
          . Join in the{" "}
          <Link
            href={MEETINGS_INFO.eventLink}
            target="_blank"
            rel="noreferrer noopener"
          >
            developer Discord
          </Link>
          , and follow{" "}
          <Link
            href={MEETINGS_INFO.xLink}
            target="_blank"
            rel="noreferrer noopener"
          >
            @BuildOnStellar
          </Link>{" "}
          on X or the{" "}
          <Link
            href={MEETINGS_INFO.youtubeLink}
            target="_blank"
            rel="noreferrer noopener"
          >
            Stellar Development Foundation
          </Link>{" "}
          on YouTube for streams and updates.
        </p>
        <div className={styles.buttonRow}>
          <Link
            className={`button button--primary ${styles.button}`}
            to="/meetings"
          >
            Recent
          </Link>
          <Link
            className={`button button--primary ${styles.button}`}
            to="/meetings/tags/developer"
          >
            Developer
          </Link>
          <Link
            className={`button button--primary ${styles.button}`}
            to="/meetings/tags/protocol"
          >
            Protocol
          </Link>
        </div>
      </div>
    </div>
  );
}

function getLocalMeetingSchedule(): string {
  try {
    return formatMeetingDisplay(getNextMeetingDate(new Date()));
  } catch {
    const hour = String(MEETINGS_INFO.hour).padStart(2, "0");
    const minute = String(MEETINGS_INFO.minute).padStart(2, "0");
    return `${MEETINGS_INFO.weekday}s at ${hour}:${minute} UTC`;
  }
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

function formatMeetingTime(date: Date): string {
  const formatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
  return formatter.format(date);
}

function makeMeetingDate(year: number, month: number, day: number): Date {
  return new Date(
    Date.UTC(year, month, day, MEETINGS_INFO.hour, MEETINGS_INFO.minute),
  );
}

function getNextMeetingDate(now: Date): Date {
  const currentIndex = now.getUTCDay();
  const targetIndex = WEEKDAY_ORDER.indexOf(MEETINGS_INFO.weekday);
  const rawDaysAhead = (targetIndex - currentIndex + 7) % 7;
  const hasMeetingPassedToday =
    rawDaysAhead === 0 &&
    (now.getUTCHours() > MEETINGS_INFO.hour ||
      (now.getUTCHours() === MEETINGS_INFO.hour &&
        now.getUTCMinutes() >= MEETINGS_INFO.minute));
  const daysAhead =
    rawDaysAhead === 0 && hasMeetingPassedToday ? 7 : rawDaysAhead;
  return makeMeetingDate(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + daysAhead,
  );
}
