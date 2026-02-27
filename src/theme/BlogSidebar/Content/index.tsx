import React, {
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import clsx from 'clsx';
import {useThemeConfig} from '@docusaurus/theme-common';
import {isSamePath} from '@docusaurus/theme-common/internal';
import {groupBlogSidebarItemsByYear} from '@docusaurus/plugin-content-blog/client';
import {useLocation} from '@docusaurus/router';
import Heading from '@theme/Heading';
import type {Props} from '@theme/BlogSidebar/Content';

import styles from './styles.module.css';

type YearGroupProps = {
  year: string;
  isExpanded: boolean;
  onToggle: () => void;
  yearGroupHeadingClassName?: string;
  children: ReactNode;
};

function BlogSidebarYearGroup({
  year,
  isExpanded,
  onToggle,
  yearGroupHeadingClassName,
  children,
}: YearGroupProps) {
  return (
    <div role="group" className={styles.yearGroup}>
      <Heading as="h3" className={yearGroupHeadingClassName}>
        <button
          type="button"
          className={clsx(styles.yearToggle, {'is-expanded': isExpanded})}
          aria-expanded={isExpanded}
          onClick={onToggle}>
          <span>{year}</span>
          <span className={styles.yearToggleIndicator} aria-hidden="true">
            {isExpanded ? '−' : '+'}
          </span>
        </button>
      </Heading>
      <div
        className={clsx(styles.yearGroupContent, {
          [styles.yearGroupContentHidden]: !isExpanded,
        })}
        aria-hidden={!isExpanded}>
        {children}
      </div>
    </div>
  );
}

function BlogSidebarContent({
  items,
  yearGroupHeadingClassName,
  ListComponent,
}: Props): ReactNode {
  const themeConfig = useThemeConfig();
  const {pathname} = useLocation();

  const shouldGroupByYear = themeConfig.blog.sidebar.groupByYear;
  const itemsByYear = useMemo(
    () => (shouldGroupByYear ? groupBlogSidebarItemsByYear(items) : []),
    [items, shouldGroupByYear],
  );

  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    if (!itemsByYear.length) {
      return;
    }
    const activeEntry = itemsByYear.find(([, yearItems]) =>
      yearItems.some((item) => isSamePath(item.permalink, pathname)),
    );
    if (activeEntry) {
      const [activeYear] = activeEntry;
      setExpandedYears((prev) =>
        prev[activeYear] ? prev : {...prev, [activeYear]: true},
      );
    }
  }, [itemsByYear, pathname]);

  const toggleYear = useCallback((year: string) => {
    setExpandedYears((prev) => ({...prev, [year]: !prev[year]}));
  }, []);

  if (!shouldGroupByYear) {
    return <ListComponent items={items} />;
  }

  return (
    <>
      {itemsByYear.map(([year, yearItems]) => (
        <BlogSidebarYearGroup
          key={year}
          year={year}
          isExpanded={!!expandedYears[year]}
          onToggle={() => toggleYear(year)}
          yearGroupHeadingClassName={yearGroupHeadingClassName}>
          {expandedYears[year] ? <ListComponent items={yearItems} /> : null}
        </BlogSidebarYearGroup>
      ))}
    </>
  );
}

export default memo(BlogSidebarContent);
