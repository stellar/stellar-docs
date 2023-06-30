import React from 'react';
import DocSidebar from '@theme-original/DocSidebar';

export default function DocSidebarWrapper(props) {
  let newProps

  // For all `/api` sidebars, remove the parent category from the sidebar
  if (props.path.startsWith('/api'))  {
    newProps = {
      ...props,
      sidebar: props.sidebar[0].items
    }
  }
  // For all other sidebars, pass the default props
  else {
    newProps = props
  }
  return (
    <>
      <DocSidebar {...newProps} />
    </>
  );
}
