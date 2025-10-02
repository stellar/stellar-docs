import React, {type ReactNode} from 'react';
import Footer from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import type {WrapperProps} from '@docusaurus/types';

import Translate from '@docusaurus/Translate';
import DocCardList from '@theme/DocCardList';
import { useDoc } from '@docusaurus/plugin-content-docs/client'
import ReaderFeedback from '@site/src/components/ReaderFeedback';
import clsx from 'clsx';

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): ReactNode {
  const { metadata } = useDoc();

  const canDisplayDocCardsOnGuide: boolean = (metadata.permalink?.includes('/docs/build/guides')
    || metadata.permalink?.includes('/docs/tools/cli/cookbook'));
  const isMainGuidesPage: boolean = metadata.id === 'build/guides/README';

  return (
    <>
      {canDisplayDocCardsOnGuide &&
        <div className={clsx(isMainGuidesPage ? 'margin-top--lg' : 'margin-top--xl')}>
          {!isMainGuidesPage && <h3>
            <Translate
              id='components.HowToGuides.GuidesInCategory'
              description='The h3 title do display the other related how-to guides'
            >Guides in this category:</Translate>
          </h3>}
          <DocCardList />
        </div>
      }
      <ReaderFeedback pageId={metadata.id} />
      <Footer {...props} />
    </>
  );
}
