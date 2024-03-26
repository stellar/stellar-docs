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
        Docusaurus was designed from the ground up to be easily installed and
        used to get your website up and running quickly.
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
        Docusaurus lets you focus on your docs, and we'll do the chores. Go
        ahead and move your docs into the <code>docs</code> directory.
      </>
    ),
    link: (
      <Link
        to="/docs/smart-contracts/getting-started/setup">
        Get Started
      </Link>
    )
  },
  {
    title: 'Issue an Asset',
    image: require('@site/static/icons/issue-assets.png').default,
    description: (
      <>
        Docusaurus lets you focus on your docs, and we'll do the chores. Go
        ahead and move your docs into the <code>docs</code> directory.
      </>
    ),
    link: (
      <Link
        to="/docs/issuing-assets/how-to-issue-an-asset">
        Issue
      </Link>
    )
  },
  {
    title: 'Build an Application',
    image: require('@site/static/icons/build-applications.png').default,
    description: (
      <>
        Docusaurus lets you focus on your docs, and we'll do the chores. Go
        ahead and move your docs into the <code>docs</code> directory.
      </>
    ),
    link: (
      <Link
        to="/docs/category/build-applications">
        Build
      </Link>
    )
  },
  {
    title: 'Developer Tools',
    image: require('@site/static/icons/dev-tools.png').default,
    description: (
      <>
        Docusaurus lets you focus on your docs, and we'll do the chores. Go
        ahead and move your docs into the <code>docs</code> directory.
      </>
    ),
    link: (
      <Link
        to="/docs/tools/developer-tools">
        See Available Tools
      </Link>
    )
  },
  {
    title: 'Access Data',
    image: require('@site/static/icons/access-data.png').default,
    description: (
      <>
        Docusaurus lets you focus on your docs, and we'll do the chores. Go
        ahead and move your docs into the <code>docs</code> directory.
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
