import React, { useEffect, useRef, type ReactNode } from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import { useHistory } from '@docusaurus/router';
import type { Props } from '@theme/NotFound/Content';
import Heading from '@theme/Heading';
import SearchPage from '@theme/SearchPage';
import { useSearchQueryString } from '@docusaurus/theme-common';

import styles from './styles.module.scss';

export default function NotFoundContent({className}: Props): ReactNode {
  const [_, setSearchQuery] = useSearchQueryString()

  const history = useHistory();

  const {
    current: { pathname, hash },
  } = useRef({ ...history.location });

  useEffect(() => {
    const parsedPath = pathname
      .split("/")
      .filter((item) => item && item !== "docs" && item !== "es")
      .map((item) => item.replace(/-/g, " "))
      .join(" ");

    const parsedHash = hash.substring(1).replace(/-/g, " ");

    const search = [parsedPath, parsedHash].filter((item) => item).join(" ");
    setSearchQuery(search);
  }, [pathname, hash]);

  return (
    <main className={clsx('container margin-vert--xl', className)}>
      <div className="row">
        <div className="col col--6 col--offset-3">
          <Heading as="h1" className="hero__title">
            <Translate
              id="theme.NotFound.title"
              description="The title of the 404 page">
              Page Not Found
            </Translate>
          </Heading>
          <p>
            <Translate
              id="theme.NotFound.p1"
              description="The first paragraph of the 404 page">
              We could not find what you were looking for.
            </Translate>
          </p>
          <p>
            <Translate
              id="theme.NotFound.p2"
              description="The 2nd paragraph of the 404 page">
              Please contact the owner of the site that linked you to the
              original URL and let them know their link is broken.
            </Translate>
          </p>
        </div>
      </div>

      <div className={styles.search}>
        <SearchPage />
      </div>
    </main>
  );
}
