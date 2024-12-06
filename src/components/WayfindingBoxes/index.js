import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const WayfindingWays = [
  {
    title: 'Asset Issuers',
    image: require('@site/static/icons/stellar-101.png').default,
    description: (
      <>
        Issue an asset on the Stellar network or create a custom smart contract token.
      </>
    ),
    link: (
      <Link
        to="#asset-issuers">
        Issue an asset
      </Link>
    ),
  },
  {
    title: 'Smart Contract Developers',
    image: require('@site/static/icons/contract.png').default,
    description: (
      <>
        Write, test, deploy, and interact with smart contracts on the Stellar network.
      </>
    ),
    // temporarily set this to /docs/soroban until "smart contracts" section is done
    link: (
      <Link
        to="#smart-contract-developers">
        Write a smart contract
      </Link>
    ),
  },
  {
    title: 'Ramps (anchors)',
    image: require('@site/static/icons/issue-assets.png').default,
    description: (
      <>
        Set up an on/off-ramp (also known as an anchor) using the SDF-maintained Anchor Platform tool.
      </>
    ),
    link: (
      <Link
        to="#ramps-anchors">
        Set up an anchor
      </Link>
    ),
  },
  {
    title: 'Applications',
    image: require('@site/static/icons/build-applications.png').default,
    description: (
      <>
        For application builders or exchanges that want to list Stellar assets.
      </>
    ),
    link: (
      <Link
        to="#applications">
        Build an app
      </Link>
    ),
  },
  {
    title: 'Infrastructure Providers',
    image: require('@site/static/icons/dev-tools.png').default,
    description: (
      <>
        Set up Stellar network infrastructure to use yourself or list as a third-party service for others.
      </>
    ),
    link: (
      <Link
        to="#infrastructure-providers">
        Set up infrastructure
      </Link>
    ),
  },
  {
    title: 'Analytics',
    image: require('@site/static/icons/access-data.png').default,
    description: (
      <>
        Perform analysis on Stellar network data.
      </>
    ),
    link: (
      <Link
        to="#analytics">
        Access Stellar network data
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
