import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import Translate, {translate} from '@docusaurus/Translate';

type WayfindingItem = {
  title: string;
  description: ReactNode;
  image: string;
  link: ReactNode;
}

const WayfindingWays: WayfindingItem[] = [
  {
    title: translate({
      message: 'Asset Issuers',
      id: 'components.WayfindingBoxes.AssetIssuers.Title',
    }),
    image: require('@site/static/icons/stellar-101.png').default,
    description: (
      <Translate
        id='components.WayfindingBoxes.AssetIssuers.Description'
        description='Short, punchy description for this "wayfinding box" on the homepage.'>
        Issue an asset or create a custom smart contract token.
      </Translate>
    ),
    link: (
      <Link
        to="#asset-issuers">
        <Translate
          id='components.WayfindingBoxes.AssetIssuers.LinkText'
          description='Button text for this "wayfinding box" on the homepage.'>
          Learn more
        </Translate>
      </Link>
    ),
  },
  {
    title: translate({
      message: 'Smart Contract Developers',
      id: 'components.WayfindingBoxes.SmartContractDevelopers.Title'
    }),
    image: require('@site/static/icons/contract.png').default,
    description: (
      <Translate
        id='components.WayfindingBoxes.SmartContractDevelopers.Description'
        description='Short, punchy description for this "wayfinding box" on the homepage.'>
        Write smart contracts on the Stellar network.
      </Translate>
    ),
    link: (
      <Link
        to="#smart-contract-developers">
        <Translate
          id='components.WayfindingBoxes.SmartContractDevelopers.LinkText'
          description='Button text for this "wayfinding box" on the homepage.'>
          Learn more
        </Translate>
      </Link>
    ),
  },
  {
    title: translate({
      message: 'Ramps (Anchors)',
      id: 'components.WayfindingBoxes.RampsAnchors.Title'
    }),
    image: require('@site/static/icons/issue-assets.png').default,
    description: (
      <Translate
        id='components.WayfindingBoxes.RampsAnchors.Description'
        description='Short, punchy description for this "wayfinding box" on the homepage.'>
        Learn about and set up an anchor.
      </Translate>
    ),
    link: (
      <Link
        to="#ramps-anchors">
        <Translate
          id='components.WayfindingBoxes.RampsAnchors.LinkText'
          description='Button text for this "wayfinding box" on the homepage.'>
          Learn more
        </Translate>
      </Link>
    ),
  },
  {
    title: translate({
      message: 'Applications',
      id: 'components.WayfindingBoxes.Applications.Title',
    }),
    image: require('@site/static/icons/build-applications.png').default,
    description: (
      <Translate
        id='components.WayfindingBoxes.Applications.Description'
        description='Short, punchy description for this "wayfinding box" on the homepage.'>
        Build a traditional wallet, dapp, or list Stellar assets on an exchange. 
      </Translate>
    ),
    link: (
      <Link
        to="#applications">
        <Translate
          id='components.WayfindingBoxes.Applications.LinkText'
          description='Button text for this "wayfinding box" on the homepage.'>
          Learn more
        </Translate>
      </Link>
    ),
  },
  {
    title: translate({
      message: 'Infrastructure Providers',
      id: 'components.WayfindingBoxes.InfrastructureProviders.Title',
    }),
    image: require('@site/static/icons/dev-tools.png').default,
    description: (
      <Translate
        id='components.WayfindingBoxes.InfrastructureProviders.Description'
        description='Short, punchy description for this "wayfinding box" on the homepage.'>
        Set up a Horizon or RPC service. 
      </Translate>
    ),
    link: (
      <Link
        to="#infrastructure-providers">
        <Translate
          id='components.WayfindingBoxes.InfrastructureProviders.LinkText'
          description='Button text for this "wayfinding box" on the homepage.'>
          Learn more
        </Translate>
      </Link>
    ),
  },
  {
    title: translate({
      message: 'Analytics',
      id: 'components.WayfindingBoxes.Analytics.Title'
    }),
    image: require('@site/static/icons/access-data.png').default,
    description: (
      <Translate
        id='components.WayfindingBoxes.Analytics.Description'
        description='Short, punchy description for this "wayfinding box" on the homepage.'>
        Use Hubble to perform analysis on Stellar network data.
      </Translate>
    ),
    link: (
      <Link
        to="#analytics">
        <Translate
          id='components.WayfindingBoxes.Analytics.LinkText'
          description='Button text for this "wayfinding box" on the homepage.'>
          Learn more
        </Translate>
      </Link>
    ),
  },
];

function WayfindingFeature({image, title, description, link}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="padding-horiz--md">
        <div>
          <Link {...link.props} className={styles.boxIconLink}><img src={image} className={styles.boxIcon} role="img" /></Link>
        </div>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
        <p className="margin-bottom--lg"><Link className="button button--outline button--primary" {...link.props} /></p>
      </div>
    </div>
  );
}

export default function WayfindingBoxes() {
  return (
    <section className='margin-vert--lg'>
      <div className="container">
        <div className="row">
          {WayfindingWays.map((props, idx) => (
            <WayfindingFeature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
