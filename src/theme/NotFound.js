import React, { useEffect, useRef } from "react";
import ReactTestUtils from "react-dom/test-utils";
import Translate, { translate } from "@docusaurus/Translate";
import { PageMetadata } from "@docusaurus/theme-common";
import { useHistory } from "@docusaurus/router";

import SearchPage from "@theme-original/SearchPage";
import Layout from "@theme/Layout";

import style from "./NotFound.module.scss";

export default () => {
  const history = useHistory();

  const {
    current: { pathname, hash },
  } = useRef({ ...history.location });

  useEffect(() => {
    const parsedPath = pathname
      .split("/")
      .filter((item) => item && item !== "docs")
      .map((item) => item.replace("-", " "))
      .join(" ");

    const parsedHash = hash.substring(1).replace("-", " ");

    const search = [parsedPath, parsedHash].filter((item) => item).join(" ");

    const searchInput = document.querySelector('input[type="search"]');

    ReactTestUtils.Simulate.change(searchInput, { target: { value: search } });
  }, [pathname, hash]);

  return (
    <>
      <PageMetadata
        title={translate({
          id: "theme.NotFound.title",
          message: "Page Not Found",
        })}
      />
      <Layout>
        <main className="container margin-vert--xl">
          <div className="row">
            <div className="col col--6 col--offset-3">
              <h1 className="hero__title">
                <Translate
                  id="theme.NotFound.title"
                  description="The title of the 404 page"
                >
                  Page Not Found
                </Translate>
              </h1>
              <p>
                <Translate
                  id="theme.NotFound.p1"
                  description="The first paragraph of the 404 page"
                >
                  We could not find what you were looking for.
                </Translate>
              </p>
              <p>
                <Translate
                  id="theme.NotFound.p2"
                  description="The 2nd paragraph of the 404 page"
                >
                  Please contact the owner of the site that linked you to the
                  original URL and let them know their link is broken.
                </Translate>
              </p>
            </div>
          </div>

          <div className={style.search}>
            <SearchPage />
          </div>
        </main>
      </Layout>
    </>
  );
};
