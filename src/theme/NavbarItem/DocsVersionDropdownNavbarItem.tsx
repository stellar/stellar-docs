import React from 'react';
import DocsVersionDropdownNavbarItem from '@theme-original/NavbarItem/DocsVersionDropdownNavbarItem';
import type DocsVersionDropdownNavbarItemType from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';
import type { WrapperProps } from '@docusaurus/types';
import { useLocation } from '@docusaurus/router';

type Props = WrapperProps<typeof DocsVersionDropdownNavbarItemType>;

export default function DocsVersionDropdownNavbarItemWrapper(props: Props): JSX.Element {
  const { docsPluginId } = props;
  const { pathname } = useLocation();

  /**
   * (Custom) check if we are in Anchor Platform docs.
   *
   * Given that the docsPluginId is 'ap' and the routeBasePath is
   * '/platforms/anchor-platform', we can check for both of those to be true. If
   * so, we want to show the version dropdown. Otherwise, we don't want to show
   * it. This gives us the appearance of one, global, context-aware version
   * dropdown that works with multi-instance setups. You want to declare a
   * version dropdown for each plugin in your navbarItems config property for
   * this to work well.
   */
  if (!(pathname.match(/^(\/es)?\/platforms\/anchor-platform/) && docsPluginId === 'ap')) {
    return null
  }
  return (
    <>
      <DocsVersionDropdownNavbarItem {...props} />
    </>
  );
}
