import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import { useDoc } from "@docusaurus/theme-common/internal";
import ReaderFeedback from '@site/src/components/ReaderFeedback';
import DocCardList from '@theme/DocCardList';
import type FooterType from '@theme/DocItem/Footer';
import type { WrapperProps } from '@docusaurus/types';
import clsx from 'clsx';

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): JSX.Element {
  const { metadata } = useDoc();

  const canDisplayDocCardsOnGuide = metadata.permalink?.startsWith('/docs/smart-contracts/guides');
  return (
    <>
      {canDisplayDocCardsOnGuide &&
        <div className={clsx(metadata.permalink === '/docs/smart-contracts/guides/' ? 'margin-top--lg' : 'margin-top--xl')}>
          {metadata.permalink !== '/docs/smart-contracts/guides/' && <h3>Guides in this category:</h3>}
          <DocCardList />
        </div>
      }
      <ReaderFeedback pageId={metadata.id} />
      <Footer {...props} />
    </>
  );
}
