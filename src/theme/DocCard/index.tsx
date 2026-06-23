import React, {type ReactNode} from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import {
  useDocById,
  useDocsVersion,
  findFirstSidebarItemLink,
} from "@docusaurus/plugin-content-docs/client";
import type {
  PropSidebarItemCategory,
  PropSidebarItemLink,
} from "@docusaurus/plugin-content-docs";
import { usePluralForm } from "@docusaurus/theme-common";
import isInternalUrl from "@docusaurus/isInternalUrl";
import { translate } from "@docusaurus/Translate";

import type { Props } from "@theme/DocCard";
import Heading from "@theme/Heading";
import styles from "./styles.module.scss";

function useCategoryItemsPlural() {
  const { selectMessage } = usePluralForm();
  return (count: number) =>
    selectMessage(
      count,
      translate(
        {
          message: "1 item|{count} items",
          id: "theme.docs.DocCard.categoryDescription.plurals",
          description:
            "Default description for a category card in the generated index about how many items this category includes",
        },
        { count },
      ),
    );
}

function getStringCustomProp(
  customProps: PropSidebarItemCategory["customProps"],
  key: string,
): string | undefined {
  const value = customProps?.[key];
  return typeof value === "string" ? value : undefined;
}

function getCategoryIndexDocIds(href: string | undefined): string[] {
  if (!href || !isInternalUrl(href)) {
    return [];
  }

  const [pathname] = href.split(/[?#]/);
  const pathSegments = pathname.replace(/^\/+|\/+$/g, "").split("/");
  const docsSegmentIndex = pathSegments.indexOf("docs");
  const docPathSegments =
    docsSegmentIndex >= 0
      ? pathSegments.slice(docsSegmentIndex + 1)
      : pathSegments;
  const docPath = docPathSegments.join("/");

  return docPath ? [`${docPath}/README`, `${docPath}/index`, docPath] : [];
}

function CardContainer({
  className,
  href,
  children,
}: {
  className?: string;
  href: string;
  children: ReactNode;
}): ReactNode {
  const linkProps = isInternalUrl(href) ? { to: href } : { href };

  return (
    <Link
      {...linkProps}
      className={clsx("card padding--lg", styles.cardContainer, className)}
    >
      {children}
    </Link>
  );
}

function CardLayout({
  className,
  href,
  icon,
  title,
  description,
}: {
  className?: string;
  href: string;
  icon: ReactNode;
  title: string;
  description?: string;
}): ReactNode {
  return (
    <CardContainer href={href} className={className}>
      <Heading
        as="h2"
        className={clsx("text--truncate", styles.cardTitle)}
        title={title}
      >
        <span aria-hidden="true">{icon}</span> {title}
      </Heading>
      {description && (
        <p
          className={styles.cardDescription}
          title={description}
        >
          {description}
        </p>
      )}
    </CardContainer>
  );
}

function CardCategory({ item }: { item: PropSidebarItemCategory }): ReactNode {
  const href = findFirstSidebarItemLink(item);
  const categoryItemsPlural = useCategoryItemsPlural();
  const { docs } = useDocsVersion();
  const categoryIndexDoc = getCategoryIndexDocIds(item.href).find(
    (docId) => docs[docId],
  );

  if (!href) {
    return null;
  }

  const description =
    item.description ??
    getStringCustomProp(item.customProps, "description") ??
    docs[categoryIndexDoc ?? ""]?.description ??
    categoryItemsPlural(item.items.length);

  return (
    <CardLayout
      className={item.className}
      href={href}
      icon="🗃️"
      title={item.label}
      description={description}
    />
  );
}

function CardLink({ item }: { item: PropSidebarItemLink }): ReactNode {
  const icon = isInternalUrl(item.href) ? "📄" : "🔗";
  const doc = useDocById(item.docId ?? undefined);
  return (
    <CardLayout
      className={item.className}
      href={item.href}
      icon={icon}
      title={item.label}
      description={item.description ?? doc?.description}
    />
  );
}

export default function DocCard({ item }: Props): ReactNode {
  switch (item.type) {
    case "link":
      return <CardLink item={item} />;
    case "category":
      return <CardCategory item={item} />;
    default:
      throw new Error(`Unknown DocCard item type: ${item.type}`);
  }
}
