import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import DocCardList from '@theme-original/DocCardList';
import type DocCardListType from '@theme/DocCardList';
import { useCurrentSidebarCategory } from '@docusaurus/plugin-content-docs/client';
import { useDocById } from '@docusaurus/plugin-content-docs/client';
import type { PropSidebarItem } from '@docusaurus/plugin-content-docs';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof DocCardListType>;

interface CustomDcListProps {
  items: PropSidebarItem[];
  className: string;
}

function DocCardListForCurrentSidebarCategory(props: CustomDcListProps): ReactNode {
  const category = useCurrentSidebarCategory();
  return (category.label === 'Example Contracts' || category.label === 'Ejemplos de contratos')
    ? <ExampleContractsDocCardList items={category.items} className={props.className} />
    : (category.label === 'How-To Guides' || category.label === 'Guías de Cómo-Hacer')
    ? <GuidesDocCardList items={category.items} className={props.className} />
    : <DocCardList items={category.items} className={props.className} />
}

function ExampleContractsDocCardList(props: CustomDcListProps): ReactNode {
  const { items, className } = props;
  return (
    <section className={clsx('row', className)}>
      {items?.map((item, _) => {
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

function GuidesDocCardList(props: CustomDcListProps): ReactNode {
  const {items, className} = props;
  return (
    <div className={clsx('row', className)}>
      {items?.map((item) => {
        if (item.type === 'category') {
          return (
            <section className={clsx('col', 'col--6', 'margin-bottom--lg', className)}>
              <h2>{item.label}</h2>
              {item.items.map((item, _) =>
                <p className='margin-bottom--sm'><a href={item.href}>{item.label}</a></p>,
              )}
            </section>
          );
        }
      })}
    </div>
  );
}

export default function DocCardListWrapper(props: Props): ReactNode {
  const { items, className } = props;

  if (!items) {
    return <DocCardListForCurrentSidebarCategory {...items} {...className} />
  }

  return (
    <>
      <DocCardList {...props} />
    </>
  );
}
