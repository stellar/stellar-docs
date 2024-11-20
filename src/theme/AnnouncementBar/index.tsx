import React from 'react';
import AnnouncementBar from '@theme-original/AnnouncementBar';
import type AnnouncementBarType from '@theme/AnnouncementBar';
import type {WrapperProps} from '@docusaurus/types';
import { useLocation } from '@docusaurus/router';

type Props = WrapperProps<typeof AnnouncementBarType>;

export default function AnnouncementBarWrapper(props: Props): JSX.Element {
  console.log('props', props)
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
