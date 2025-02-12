import React, { type ReactNode } from 'react';
import AnnouncementBar from '@theme-original/AnnouncementBar';
import type AnnouncementBarType from '@theme/AnnouncementBar';
import type {WrapperProps} from '@docusaurus/types';
import { useLocation } from '@docusaurus/router';

type Props = WrapperProps<typeof AnnouncementBarType>;

export default function AnnouncementBarWrapper(props: Props): ReactNode {
  const location = useLocation();

  if (!location.pathname.startsWith('/es')) {
    return null
  }

  return (
    <>
      <AnnouncementBar {...props} />
    </>
  );
}
