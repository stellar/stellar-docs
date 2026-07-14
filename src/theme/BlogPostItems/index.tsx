import React, { type ReactNode } from "react";
import { useLocation } from "@docusaurus/router";
import type { WrapperProps } from "@docusaurus/types";
import OriginalBlogPostItems from "@theme-original/BlogPostItems";
import type BlogPostItemsType from "@theme/BlogPostItems";

import MeetingIndexCard from "../../components/MeetingIndexCard";

const MEETING_ROUTE = "/meetings";

type Props = WrapperProps<typeof BlogPostItemsType>;

export default function BlogPostItemsWrapper(props: Props): ReactNode {
  const { pathname } = useLocation();

  return (
    <>
      {pathname === MEETING_ROUTE ? <MeetingIndexCard /> : null}
      <OriginalBlogPostItems {...props} />
    </>
  );
}
