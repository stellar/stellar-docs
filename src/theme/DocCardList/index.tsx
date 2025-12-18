import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import DocCardList from '@theme-original/DocCardList';
import type DocCardListType from '@theme/DocCardList';
import { useCurrentSidebarCategory, useDocById } from '@docusaurus/plugin-content-docs/client';
import type { PropSidebarItem } from '@docusaurus/plugin-content-docs';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof DocCardListType>;

interface CustomDocCardListProps {
  items: PropSidebarItem[];
  className: string;
}


function DocCardListForCurrentSidebarCategory(props: CustomDocCardListProps): ReactNode {
  const category = useCurrentSidebarCategory()

  const exampleContractsLabels = ['Example Contracts', 'Ejemplos de contratos'];
  const howToGuidesLabels = ['How-To Guides', 'Guías de Cómo-Hacer'];

  if (exampleContractsLabels.includes(category.label)) {
    return <ExampleContractsDocCardList items={category.items} className={props.className} />
  } else if (howToGuidesLabels.includes(category.label)) {
    return <GuidesDocCardList items={category.items} className={props.className} />
  }
  return <DocCardList items={category.items} className={props.className} />
}

function ExampleContractsDocCardList(props: CustomDocCardListProps): ReactNode {
  const { items, className } = props;
  return (
    <section className={clsx('row', className)}>
      {items?.filter(item => item.type === 'link').map((item) => {
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

function GuidesDocCardList(props: CustomDocCardListProps): ReactNode {
  const {items, className} = props;
  return (
    <div className={clsx('row', className)}>
      {items?.filter(item => item.type === 'category').map((item) => {
        return (
          <section className={clsx('col', 'col--6', 'margin-bottom--lg', className)}>
            <h2>{item.label}</h2>
            {item.items.filter(item => item.type === 'link').map((item) =>
              <p className='margin-bottom--sm'><a href={item.href}>{item.label}</a></p>,
            )}
          </section>
        );
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
