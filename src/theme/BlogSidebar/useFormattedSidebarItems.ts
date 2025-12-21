import {useMemo} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {BlogSidebarItem} from '@docusaurus/plugin-content-blog';

const ISO_TITLE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;
const DEFAULT_FORMATTER_KEY = 'default';
const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(locale?: string): Intl.DateTimeFormat {
  const cacheKey = `${locale ?? DEFAULT_FORMATTER_KEY}-monthDay`;
  let formatter = formatterCache.get(cacheKey);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale ?? undefined, {
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
    formatterCache.set(cacheKey, formatter);
  }
  return formatter;
}

function parseDateFromTitle(title?: string): Date | null {
  if (!title) {
    return null;
  }
  const match = ISO_TITLE_REGEX.exec(title.trim());
  if (!match) {
    return null;
  }
  const [, yearStr, monthStr, dayStr] = match;
  const year = Number(yearStr);
  const monthIndex = Number(monthStr) - 1;
  const day = Number(dayStr);
  if (
    Number.isNaN(year) ||
    Number.isNaN(monthIndex) ||
    Number.isNaN(day) ||
    monthIndex < 0 ||
    monthIndex > 11 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }
  return new Date(Date.UTC(year, monthIndex, day));
}

function toDate(value?: string | Date): Date | null {
  if (!value) {
    return null;
  }
  const date = typeof value === 'string' ? new Date(value) : value;
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatSidebarTitle(item: BlogSidebarItem, locale?: string): string | null {
  const derivedDate = parseDateFromTitle(item.title) ?? toDate(item.date);
  if (!derivedDate) {
    return null;
  }
  return getFormatter(locale).format(derivedDate);
}

export function useFormattedSidebarItems(items: BlogSidebarItem[]): BlogSidebarItem[] {
  const {i18n} = useDocusaurusContext();
  const currentLocale = i18n?.currentLocale;

  return useMemo(
    () =>
      items.map((item) => {
        const formattedTitle = formatSidebarTitle(item, currentLocale);
        if (!formattedTitle || formattedTitle === item.title) {
          return item;
        }
        return {...item, title: formattedTitle};
      }),
    [items, currentLocale],
  );
}
