import React, { type ReactNode } from 'react';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import clsx from 'clsx';
import styles from './styles.module.css'

export type NavigatingDocsItem = {
  title: string;
  description: ReactNode;
  link: ReactNode;
}

export const exploreLink = (target: string) => (
  <Link to={target}>
    <Translate
      id='component.Homepage.ExploreButton.Text'
      description='The text that will be displayed on the "Explore" buttons'>
      Explore
    </Translate>
  </Link>
)

export const partitionBoxes = (boxesArray: NavigatingDocsItem[]): NavigatingDocsItem[][] => {
  return boxesArray.reduce((acc, item, i, arr) => {
    if (i % 2 === 0) {
      acc.push(arr.slice(i, i + 2))
    }
    return acc
  }, [])
}

const NavigatingDocsBoxes: NavigatingDocsItem[] = [
  {
    title: translate({
      message: 'Build',
      id: 'component.Homepage.NavigatingTheDocs.Build.Title',
    }),
    description: (
      <Translate
        id='component.Homepage.NavigatingTheDocs.Build.Description'
        description='Long description of what kind of information this section of the docs.'>
        Contains tutorials and how-to guides for writing smart contracts, building applications, interacting with the network, and more.
      </Translate>
    ),
    link: exploreLink('/docs/build'),
  },
  {
    title: translate({
      message: 'Learn',
      id: 'component.Homepage.NavigatingTheDocs.Learn.Title',
    }),
    description: (
      <Translate
        id='component.Homepage.NavigatingTheDocs.Learn.Description'
        description='Long description of what kind of information this section of the docs.'>
        Find all informational and conceptual content here. Learn about Stellar fundamentals like how accounts and transactions function, dive deeper into the functionality of each operation, discover how fees work, and more.
      </Translate>
    ),
    link: exploreLink('/docs/learn/fundamentals'),
  },
  {
    title: translate({
      message: 'Tokens',
      id: 'component.Homepage.NavigatingTheDocs.Tokens.Title',
    }),
    description: (
      <Translate
        id='component.Homepage.NavigatingTheDocs.Tokens.Description'
        description='Long description of what kind of information this section of the docs.'>
        Information on how to issue assets on the Stellar network and create custom smart contract tokens.
      </Translate>
    ),
    link: exploreLink('/docs/tokens'),
  },
  {
    title: translate({
      message: 'Data',
      id: 'component.Homepage.NavigatingTheDocs.Data.Title',
    }),
    description: (
      <Translate
        id='component.Homepage.NavigatingTheDocs.Data.Description'
        description='Long description of what kind of information this section of the docs.'>
        Discover various data availability options: RPC, Hubble, Horizon, Galexie, and data indexers.
      </Translate>
    ),
    link: exploreLink('/docs/data'),
  },
  {
    title: translate({
      message: 'Tools',
      id: 'component.Homepage.NavigatingTheDocs.Tools.Title',
    }),
    description: (
      <Translate
        id='component.Homepage.NavigatingTheDocs.Tools.Description'
        description='Long description of what kind of information this section of the docs.'>
        Learn about all the available tools for building on, interacting with, or just watching the Stellar network. Also, find information on how to use the Anchor Platform or Stellar Disbursement Platform.
      </Translate>
    ),
    link: exploreLink('/docs/tools'),
  },
  {
    title: translate({
      message: 'Networks',
      id: 'component.Homepage.NavigatingTheDocs.Networks.Title',
    }),
    description: (
      <Translate
        id='component.Homepage.NavigatingTheDocs.Networks.Description'
        description='Long description of what kind of information this section of the docs.'>
        Information about deployed networks (Mainnet, Testnet, and Futurenet), current software versions, resource limitations, and fees.
      </Translate>
    ),
    link: exploreLink('/docs/networks'),
  },
  {
    title: translate({
      message: 'Validators',
      id: 'component.Homepage.NavigatingTheDocs.Validators.Title',
    }),
    description: (
      <Translate
        id='component.Homepage.NavigatingTheDocs.Validators.Description'
        description='Long description of what kind of information this section of the docs.'>
        Everything you'll need to know if you want to run, operate, and maintain a core validator node on the Stellar network.
      </Translate>
    ),
    link: exploreLink('/docs/validators'),
  },
]

function NavigatingDocsFeature({title, description, link}) {
  return (
    <div className='col col--6 padding--md'>
      <div className={clsx(styles.NavigatingDocsFeature, 'padding--lg')}>
        <Heading as="h3" className='text--semibold'>{title}</Heading>
        <p>{description}</p>
        <Link className='button button--outline button--primary' {...link.props} />
      </div>
    </div>
  )
}

export default function NavigatingTheDocs() {
  const partitionedBoxes = partitionBoxes(NavigatingDocsBoxes)

  return (
    <section className='margin-vert--lg'>
      {partitionedBoxes.map((twoBoxes) => (
        <div className='row'>
          {twoBoxes.map((props, idx) => (
            <NavigatingDocsFeature key={idx} {...props} />
          ))}
        </div>
      ))}
    </section>
  )
}
