import React, { type ReactNode } from 'react';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import clsx from 'clsx';
import styles from './styles.module.css'

type NavigatingDocsItem = {
  title: string;
  description: ReactNode;
  link: ReactNode;
}

const learnMoreLink = (target: string) => (
  <Link to={target}>
    <Translate
      id='component.NavigatingTheDocs.LearnMoreButton.Text'
      description='The text that will be displayed on the "Learn more" buttons'>
      Learn more
    </Translate>
  </Link>
)

const partitionBoxes = (boxesArray: NavigatingDocsItem[]): NavigatingDocsItem[][] => {
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
      id: 'component.NavigatingTheDocs.Build.Title',
    }),
    description: (
      <Translate
        id='component.NavigatingTheDocs.Build.Description'
        description='Long description of what kind of information this section of the docs.'>
        Contains tutorials and how-to guides for writing smart contracts, building applications, interacting with the network, and more.
      </Translate>
    ),
    link: learnMoreLink('/docs/build'),
  },
  {
    title: translate({
      message: 'Learn',
      id: 'component.NavigatingTheDocs.Learn.Title',
    }),
    description: (
      <Translate
        id='component.NavigatingTheDocs.Learn.Description'
        description='Long description of what kind of information this section of the docs.'>
        Find all informational and conceptual content here. Learn about Stellar fundamentals like how accounts and transactions function, dive deeper into the functionality of each operation, discover how fees work, and more.
      </Translate>
    ),
    link: learnMoreLink('/docs/learn/fundamentals'),
  },
  {
    title: translate({
      message: 'Tokens',
      id: 'component.NavigatingTheDocs.Tokens.Title',
    }),
    description: (
      <Translate
        id='component.NavigatingTheDocs.Tokens.Description'
        description='Long description of what kind of information this section of the docs.'>
        Information on how to issue assets on the Stellar network and create custom smart contract tokens.
      </Translate>
    ),
    link: learnMoreLink('/docs/tokens'),
  },
  {
    title: translate({
      message: 'Data',
      id: 'component.NavigatingTheDocs.Data.Title',
    }),
    description: (
      <Translate
        id='component.NavigatingTheDocs.Data.Description'
        description='Long description of what kind of information this section of the docs.'>
        Discover various data availability options: RPC, Hubble, and Horizon.
      </Translate>
    ),
    link: learnMoreLink('/docs/data'),
  },
  {
    title: translate({
      message: 'Tools',
      id: 'component.NavigatingTheDocs.Tools.Title',
    }),
    description: (
      <Translate
        id='component.NavigatingTheDocs.Tools.Description'
        description='Long description of what kind of information this section of the docs.'>
        Learn about all the available tools at your disposal for building on, interacting with, or just watching the Stellar network. Also, find information on how to use the Anchor Platform or Stellar Disbursement Platform.
      </Translate>
    ),
    link: learnMoreLink('/docs/tools'),
  },
  {
    title: translate({
      message: 'Networks',
      id: 'component.NavigatingTheDocs.Networks.Title',
    }),
    description: (
      <Translate
        id='component.NavigatingTheDocs.Networks.Description'
        description='Long description of what kind of information this section of the docs.'>
        Information about deployed networks (Mainnet, Testnet, and Futurenet), current software versions, and resource limitations and fees.
      </Translate>
    ),
    link: learnMoreLink('/docs/networks'),
  },
  {
    title: translate({
      message: 'Validators',
      id: 'component.NavigatingTheDocs.Validators.Title',
    }),
    description: (
      <Translate
        id='component.NavigatingTheDocs.Validators.Description'
        description='Long description of what kind of information this section of the docs.'>
        Everything you'll need to know if you want to run, operate, and maintain a core validator node on the Stellar network.
      </Translate>
    ),
    link: learnMoreLink('/docs/validators'),
  },
]

function NavigatingDocsFeature({title, description, link}) {
  return (
    <div className='col col--6 padding--md'>
      <div className={clsx(styles.NavigatingDocsFeature, 'padding--lg')}>
        <Heading as="h3">{title}</Heading>
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
      <div className="container">
          {partitionedBoxes.map((twoBoxes) => (
            <div className='row'>
            {twoBoxes.map((props, idx) => (
              <NavigatingDocsFeature key={idx} {...props} />
            ))}
            </div>
          ))}
      </div>
    </section>
  )
}
