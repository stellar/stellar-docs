import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import Translate from '@docusaurus/Translate';

const WayfindingWays = [
  {
    title: 'Stellar 101',
    image: require('@site/static/icons/stellar-101.png').default,
    description: (
      <Translate
        id='components.WayfindingBoxes.Stellar101.Description'
        description='Shorty, punchy description for this "wayfinding box" on the homepage.'>
        Learn about the core concepts of Stellar in this educational section.
      </Translate>
    ),
    link: (
      <Link
        to="/docs/learn/fundamentals">
        <Translate
          id='components.WayfindingBoxes.Stellar101.LinkText'
          description='Button text for this "wayfinding box" on the homepage.'>
          Dive In
        </Translate>
      </Link>
    ),
  },
  {
    title: 'Write a Smart Contract',
    image: require('@site/static/icons/contract.png').default,
    description: (
      <Translate
        id='components.WayfindingBoxes.WriteASmartContract.Description'
        description='Shorty, punchy description for this "wayfinding box" on the homepage.'>
        Get set up and write your first smart contract on the Stellar network.
      </Translate>
    ),
    // temporarily set this to /docs/soroban until "smart contracts" section is done
    link: (
      <Link
        to="/docs/build/smart-contracts/getting-started/setup">
        <Translate
          id='components.WayfindingBoxes.WriteASmartContract.LinkText'
          description='Button text for this "wayfinding box" on the homepage.'>
          Get Started
        </Translate>
      </Link>
    ),
  },
  {
    title: 'Issue an Asset',
    image: require('@site/static/icons/issue-assets.png').default,
    description: (
      <Translate
        id='components.WayfindingBoxes.IssueAnAsset.Description'
        description='Shorty, punchy description for this "wayfinding box" on the homepage.'>
        Issuing assets on Stellar is easy. Learn how in this tutorial.
      </Translate>
    ),
    link: (
      <Link
        to="/docs/tokens/how-to-issue-an-asset">
        <Translate
          id='components.WayfindingBoxes.IssueAnAsset.LinkText'
          description='Button text for this "wayfinding box" on the homepage.'>
          Issue Asset
        </Translate>
      </Link>
    ),
  },
  {
    title: 'Build an Application',
    image: require('@site/static/icons/build-applications.png').default,
    description: (
      <Translate
        id='components.WayfindingBoxes.BuildAnApplication.Description'
        description='Shorty, punchy description for this "wayfinding box" on the homepage.'>
        Build an application on Stellar using the Wallet SDK or JS SDK.
      </Translate>
    ),
    link: (
      <Link
        to="/docs/build/apps">
        <Translate
          id='components.WayfindingBoxes.BuildAnApplication.LinkText'
          description='Button text for this "wayfinding box" on the homepage.'>
          Get Building
        </Translate>
      </Link>
    ),
  },
  {
    title: 'Developer Tools',
    image: require('@site/static/icons/dev-tools.png').default,
    description: (
      <Translate
        id='components.WayfindingBoxes.DeveloperTools.Description'
        description='Shorty, punchy description for this "wayfinding box" on the homepage.'>
        Stellar has a myriad of community and SDF-maintained tools. Check them out!
      </Translate>
    ),
    link: (
      <Link
        to="/docs/tools/developer-tools">
        <Translate
          id='components.WayfindingBoxes.DeveloperTools.LinkText'
          description='Button text for this "wayfinding box" on the homepage.'>
          See Tools
        </Translate>
      </Link>
    ),
  },
  {
    title: 'Access Data',
    image: require('@site/static/icons/access-data.png').default,
    description: (
      <Translate
        id='components.WayfindingBoxes.AccessData.Description'
        description='Shorty, punchy description for this "wayfinding box" on the homepage.'>
        The RPC, Hubble, and Horizon offer all the data capabilities you could possibly need.
      </Translate>
    ),
    link: (
      <Link
        to="/docs/data">
        <Translate
          id='components.WayfindingBoxes.AccessData.LinkText'
          description='Button text for this "wayfinding box" on the homepage.'>
          Get the Goods
        </Translate>
      </Link>
    ),
  },
];

function Feature({image, title, description, link}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Link {...link.props} className={clsx(styles.boxIconLink, 'button', 'button--secondary')}><img src={image} className={styles.boxIcon} role="img" /></Link>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
        <p className="margin-bottom--lg"><Link className="button button--primary" {...link.props} /></p>
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
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
