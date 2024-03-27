import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

const WayfindingWays = [
  {
    title: 'Stellar 101',
    image: require('@site/static/icons/stellar-101.png').default,
    description: (
      <>
        Learn the core concepts of Stellar in this educational section.
      </>
    ),
    link: (
      <Link
        to="/docs/learn/fundamentals">
        Dive In
      </Link>
    )
  },
  {
    title: 'Write a Smart Contract',
    image: require('@site/static/icons/contract.png').default,
    description: (
      <>
        Get set up and write your first smart contract on the Stellar network.
      </>
    ),
    // temporarily set this to /docs/soroban until "smart contracts" section is done
    link: (
      <Link
        to="/docs/soroban">
        Get Started
      </Link>
    )
  },
  {
    title: 'Issue an Asset',
    image: require('@site/static/icons/issue-assets.png').default,
    description: (
      <>
        Issuing assets on Stellar is easy. Learn how in this tutorial.
      </>
    ),
    link: (
      <Link
        to="/docs/issuing-assets/how-to-issue-an-asset">
        Issue Asset
      </Link>
    )
  },
  {
    title: 'Build an Application',
    image: require('@site/static/icons/build-applications.png').default,
    description: (
      <>
        Build an application on Stellar using the Wallet SDK or JS SDK.
      </>
    ),
    link: (
      <Link
        to="/docs/category/build-applications">
        Get Building
      </Link>
    )
  },
  {
    title: 'Developer Tools',
    image: require('@site/static/icons/dev-tools.png').default,
    description: (
      <>
        Stellar has a myriad of community and SDF-maintained tools. Check them out!
      </>
    ),
    link: (
      <Link
        to="/docs/tools/developer-tools">
        See Tools
      </Link>
    )
  },
  {
    title: 'Access Data',
    image: require('@site/static/icons/access-data.png').default,
    description: (
      <>
        The RPC, Hubble, and Horizon offer all the data capabilities you could possibly need.
      </>
    ),
    link: (
      <Link
        to="/network">
        Get the Goods
      </Link>
    )
  },
];

function Feature({image, title, description, link}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Link {...link.props}><img src={image} className={styles.boxIcon} role="img" /></Link>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
        <p><Link className="button button--primary" {...link.props} /></p>
      </div>
    </div>
  );
}

export default function WayfindingBoxes() {
  return (
    <section className={styles.boxes}>
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
