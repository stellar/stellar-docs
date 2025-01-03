import React, { type ReactNode } from 'react'
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import { exploreLink, partitionBoxes, type NavigatingDocsItem as DeveloperResourcesItem } from '@site/src/components/Homepage/NavigatingTheDocs'
import Translate, { translate } from '@docusaurus/Translate'
import styles from './styles.module.css'

const DeveloperResourcesBoxes: DeveloperResourcesItem[] = [
  {
    title: translate({
      message: 'Stellar Developer Discord',
      id: 'component.Homepage.DeveloperResources.Discord.Title',
    }),
    description: (
      <Translate
        id='component.Homepage.DeveloperResources.Discord.Description'
        description='Long description of what kind of developer resource this is.'>
        Ask questions and engage with other Stellar devs.
      </Translate>
    ),
    link: exploreLink('https://discord.gg/stellardev'),
  },
  {
    title: translate({
      message: 'Developer Site',
      id: 'component.Homepage.DeveloperResources.DeveloperSite.Title',
    }),
    description: (
      <Translate
        id='component.Homepage.DeveloperResources.DeveloperSite.Description'
        description='Long description of what kind of developer resource this is.'>
        Get the latest news and insights about building on Stellar.
      </Translate>
    ),
    link: exploreLink('https://stellar.org/developers'),
  },
  {
    title: translate({
      message: 'Stellar Stack Exchange',
      id: 'component.Homepage.DeveloperResources.StackExchange.Title',
    }),
    description: (
      <Translate
        id='component.Homepage.DeveloperResources.StackExchange.Description'
        description='Long description of what kind of developer resource this is.'>
        A question and answer site for Stellar developers; if you can’t find what you’re looking for in the docs, try searching the Stack Exchange to see if your question has been addressed. If it hasn't, feel free to ask!
      </Translate>
    ),
    link: exploreLink('https://stellar.stackexchange.com/'),
  },
  {
    title: translate({
      message: 'Stellar Developers Google Group',
      id: 'component.Homepage.DeveloperResources.GoogleGroup.Title',
    }),
    description: (
      <Translate
        id='component.Homepage.DeveloperResources.GoogleGroup.Description'
        description='Long description of what kind of developer resource this is.'>
        Discuss Core Advancement Proposals (CAPs) and Stellar Ecosystem Proposals (SEPs), talk about the development of Stellar Core and Horizon, and stay informed about important network upgrades.
      </Translate>
    ),
    link: exploreLink('https://groups.google.com/g/stellar-dev'),
  },
]

function DeveloperResourcesFeature({title, description, link}) {
  return (
    <div className='col col--6 padding--md'>
      <div className={clsx(styles.DeveloperResourcesFeature, 'padding--lg')}>
        <Heading as="h3" className='text--semibold'>{title}</Heading>
        <p>{description}</p>
        <Link className='button button--outline button--primary' {...link.props} />
      </div>
    </div>
  )
}

function DocsContribution() {
  return (
    <>
      <Heading as="h3" className='text--semibold'>
        <Translate
          id='component.Homepage.DocsContribution.Heading'>
          Contribute to the docs and leave feedback
        </Translate>
      </Heading>
      <p>
        <Translate
          id='component.Homepage.DocsContribution.Paragraph1'
          values={{
            githubRepoLink: (
              <Link to="https://github.com/stellar/stellar-docs">
                <Translate
                  id='component.Homepage.DocsContribution.DocsGithubLink'
                  description='Label for the link to the Stellar docs repository on Github'>
                  Stellar Docs GitHub Repo
                </Translate>
              </Link>
            )
          }}>
          {'Stellar’s Developer Documentation is open-source, and contributions to the docs are encouraged. You can file an issue or pull request to add new content, suggest revisions to existing content, submit suggestions, report bugs, and more in the {githubRepoLink}.'}
        </Translate>
      </p>
      <p>
        <Translate
          id='component.Homepage.DocsContribution.Paragraph2'
          values={{
            githubOrgLink: (
              <Link to="https://github.com/stellar">
                <Translate
                  id='component.Homepage.DocsContribution.StellarRepos'
                  description='Label for the link to the Stellar organization profile on Github'>
                  Stellar repos
                </Translate>
              </Link>
            )
          }}>
          {'Also, feel free to leave any additional feedback by filing issues in the various other {githubOrgLink}.'}
        </Translate>
      </p>
    </>
  )
}

export default function DeveloperResources() {
  const partitionedBoxes = partitionBoxes(DeveloperResourcesBoxes);

  return (
    <section className='margin-vert--lg'>
      {partitionedBoxes.map((twoBoxes) => (
        <div className='row'>
          {twoBoxes.map((props, idx) => (
            <DeveloperResourcesFeature key={idx} {...props} />
          ))}
        </div>
      ))}
      <div className='row'>
        <div className='col padding--md'>
          <div className={clsx(styles.DeveloperResourcesFeature, 'padding--lg')}>
            <DocsContribution />
          </div>
        </div>
      </div>
    </section>
  )
}
