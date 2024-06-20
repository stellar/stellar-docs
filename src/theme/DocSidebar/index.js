import React from 'react';
import DocSidebar from '@theme-original/DocSidebar';

export default function DocSidebarWrapper(props) {
  let newProps

  // For all `/platforms` and `/docs/data` sidebars, remove the parent category from the sidebar
  if (props.path.startsWith('/platforms') || props.path.startsWith('/docs/data'))  {
    newProps = {
      ...props,
      // sidebar: props.sidebar[0].items
    }
    if (props.sidebar[0].items) {
      newProps.sidebar = props.sidebar[0].items
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
