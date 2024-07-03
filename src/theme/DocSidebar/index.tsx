import React from 'react';
import DocSidebar from '@theme-original/DocSidebar';
import type DocSidebarType from '@theme/DocSidebar';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof DocSidebarType>;

export default function DocSidebarWrapper(props: Props): JSX.Element {
  let newProps;

  // For all `/platforms` and `/docs/data` sidebars, remove the parent category from the sidebar.
  if (props.path.startsWith('/platforms') || props.path.startsWith('/docs/data')) {
    newProps = {
      ...props,
    };
    if (props.sidebar[0].type === 'category') {
      newProps.sidebar = props.sidebar[0].items;
    }
  } else {
    // For all other sidebars, pass the default props.
    newProps = props;
  }

  return (
    <>
      <DocSidebar {...newProps} />
    </>
  );
}
