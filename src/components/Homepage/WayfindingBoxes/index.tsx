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

export const learnMoreLink = (target: string) => (
  <Link to={target}>
    <Translate
      id='component.Homepage.LearnMoreButton.Text'
      description='The text that will be displayed on the "Learn More" buttons'>
      Learn More
    </Translate>
  </Link>
)

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
    link: learnMoreLink("#asset-issuers"),
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
    link: learnMoreLink("#smart-contract-developers"),
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
    link: learnMoreLink("#ramps-anchors"),
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
    link: learnMoreLink("#applications"),
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
    link: learnMoreLink("#infrastructure-providers"),
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
    link: learnMoreLink("#analytics"),
  },
];

function WayfindingFeature({image, title, description, link}) {
  return (
    <div className={clsx('col col--4')}>
      <div>
        <Link {...link.props} className={styles.boxIconLink}><img src={image} className={styles.boxIcon} role="img" /></Link>
      </div>
      <Heading as="h3" className='text--semibold'>{title}</Heading>
      <p>{description}</p>
      <p className="margin-bottom--lg"><Link className="button button--outline button--primary" {...link.props} /></p>
    </div>
  );
}

export default function WayfindingBoxes() {
  return (
    <section className='margin-vert--lg'>
      <div className="row">
        {WayfindingWays.map((props, idx) => (
          <WayfindingFeature key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}
