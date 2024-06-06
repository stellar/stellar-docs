import React from 'react';
import clsx from 'clsx';
import DocCardList from '@theme-original/DocCardList';
import {
  useCurrentSidebarCategory,
  filterDocCardListItems,
} from '@docusaurus/theme-common';
import {
  useDocById,
} from '@docusaurus/theme-common/internal';
import type DocCardListType from '@theme/DocCardList';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof DocCardListType>;

function DocCardListForCurrentSidebarCategory(props: Props): JSX.Element {
  const category = useCurrentSidebarCategory();
  return category.label === 'Example Contracts'
    ? <ExampleContractsDocCardList items={category.items} className={props.className} />
    : category.label === 'How-To Guides'
    ? <GuidesDocCardList items={category.items} className={props.className} />
    : <DocCardList items={category.items} className={props.className} />;
}

function GuidesDocCardList(props: Props): JSX.Element {
  const {items, className} = props;
  return (
    <div className={clsx('row', className)}>
      {items?.map((item) => {
        if (item.type === 'category') {
          return (
            <section className={clsx('col', 'col--6', 'margin-bottom--lg', className)}>
              <h2>{item.label}</h2>
              {item.items.map((item, index) =>
                <p className='margin-bottom--sm'><a href={item.href}>{item.label}</a></p>,
              )}
            </section>
          );
        }
      })}
    </div>
  );
}

function ExampleContractsDocCardList(props: Props): JSX.Element {
  const { items, className } = props;
  return (
    <section className={clsx('row', className)}>
      {items?.map((item, index) => {
        const doc = useDocById(item.docId ?? undefined);
        item.description = item.description ?? doc?.description;
        return (
          <p className='col col--12'>
            <a href={item.href}><strong>{item.label}</strong></a> - {item.description}
          </p>
        );
      })}
    </section>
  );
}

export default function DocCardListWrapper(props: Props): JSX.Element {
  const { items } = props;
  if (!items) {
    return <DocCardListForCurrentSidebarCategory {...props} />;
  }
  return (
    <>
      <DocCardList {...props} />
    </>
  );
}
