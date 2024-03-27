import React, {useState} from 'react';
import clsx from 'clsx';
import {
  useCurrentSidebarCategory,
  filterDocCardListItems,
} from '@docusaurus/theme-common';
import {
  useDocById,
} from '@docusaurus/theme-common/internal';
import DocCard from '@theme/DocCard';
import styles from './style.module.css'
import { title } from 'process';

function DocCardListForCurrentSidebarCategory({className}) {
  const category = useCurrentSidebarCategory();
  return category.label === 'Example Contracts'
    ? <ExampleContractsDocCardList items={category.items} className={className} />
    : category.label === 'How-To Guides'
    ? <GuidesDocCardList items={category.items} className={className} />
    : <DocCardList items={category.items} className={className} />;
}

function GuidesDocCardList(props) {
  const {items, className} = props;
  return (
    <div className={clsx('row', className)}>
      {items.map((item, index) => {
        if (item.type === 'category') {
          return (
            <section className={clsx('col', 'col--6', 'margin-bottom--lg', className)}>
              <h2>{item.label}</h2>
              {item.items.map((item, index) =>
                <p className='margin-bottom--sm'><a href={item.href}>{item.label}</a></p>
              )}
            </section>
          )
        }
      })}
    </div>
  )
}

function ExampleContractsDocCardList(props) {
  const {items, className} = props;
  return (
    <section className={clsx('row', className)}>
      {items.map((item, index) => {
        const doc = useDocById(item.docId ?? undefined);
        item.description = item.description ?? doc?.description
        return (
          <p className='col col--12'>
            <a href={item.href}><strong>{item.label}</strong></a> - {item.description}
          </p>
        )
      })}
    </section>
  )
}

export default function DocCardList(props) {
  const {items, className} = props;
  if (!items) {
    return <DocCardListForCurrentSidebarCategory {...props} />;
  }
  const filteredItems = filterDocCardListItems(items);
  return (
    <section className={clsx('row', className)}>
      {filteredItems.map((item, index) =>
        <article key={index} className="col col--6 margin-bottom--lg">
          <DocCard item={item} />
        </article>
      )}
    </section>
  );
}
