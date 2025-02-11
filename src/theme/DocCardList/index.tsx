import React, {type ReactNode} from 'react';
import DocCardList from '@theme-original/DocCardList';
import type DocCardListType from '@theme/DocCardList';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof DocCardListType>;

export default function DocCardListWrapper(props: Props): ReactNode {
  return (
    <>
      <DocCardList {...props} />
    </>
  );
}
