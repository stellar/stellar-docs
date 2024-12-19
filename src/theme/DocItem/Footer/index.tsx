import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import { useDoc } from "@docusaurus/theme-common/internal";
import ReaderFeedback from '@site/src/components/ReaderFeedback';
import DocCardList from '@theme/DocCardList';
import type FooterType from '@theme/DocItem/Footer';
import type { WrapperProps } from '@docusaurus/types';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): JSX.Element {
  const { metadata } = useDoc();

  const canDisplayDocCardsOnGuide = metadata.permalink?.includes('/docs/build/guides');
  const isMainGuidesPage = metadata.id === 'build/guides/README'
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
