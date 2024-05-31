import React from 'react';
import DocSidebar from '@theme-original/DocSidebar';
import type DocSidebarType from '@theme/DocSidebar';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof DocSidebarType>;

export default function DocSidebarWrapper(props: Props): JSX.Element {
  let newProps;

  // For all `/network` sidebars, remove the parent category from the sidebar
  if (props.path.startsWith('/network'))  {
    newProps = {
      ...props,
      sidebar: props.sidebar[0]?.items ?? undefined,
    };
  }
  // For all other sidebars, pass the default props
  else {
    newProps = props;
  }

  return (
    <>
      <DocSidebar {...newProps} />
    </>
  );
}
