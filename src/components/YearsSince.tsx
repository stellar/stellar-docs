import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

type YearsSinceProps = {
  date: string; // expects datetime in UTC
};

function parseDate(value: string): Date | null {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

function yearsBetweenUTC(from: Date, to: Date): number {
  let years = to.getUTCFullYear() - from.getUTCFullYear();
  const anniversaryInToYear = new Date(Date.UTC(
    to.getUTCFullYear(),
    from.getUTCMonth(),
    from.getUTCDate(),
    from.getUTCHours(),
    from.getUTCMinutes(),
    from.getUTCSeconds(),
    from.getUTCMilliseconds(),
  ));

  if (to.getTime() < anniversaryInToYear.getTime()) {
    years -= 1;
  }
  return years;
}

export default function YearsSince({date}: YearsSinceProps): React.ReactElement {
  const parsedDate = parseDate(date);
  if (!parsedDate) {
    return <>{"?"}</>;
  }

  const render = (now: Date) => Math.max(0, yearsBetweenUTC(parsedDate, now));
  const serverValue = render(new Date());

  return (
    <BrowserOnly fallback={<>{serverValue}</>}>
      {() => <>{render(new Date())}</>}
    </BrowserOnly>
  );
}
