import React from "react";
import { MDXProvider } from "@mdx-js/react";
import Layout from "@theme-original/ApiItem/Layout";
import { useDoc } from "@docusaurus/theme-common/internal";

import { WrapperApiReference } from "@site/src/components/WrapperApiReference";

import styles from "./styles.module.scss";

const LayoutWrapper = (props) => {
  const {
    frontMatter: { api },
  } = useDoc();

  const layout = <Layout {...props} />;

  if (api) {
    return layout;
  }

  return (
    <MDXProvider components={{ wrapper: WrapperApiReference }}>
      <div className={styles.LayoutWrapper}>{layout}</div>
    </MDXProvider>
  );
};

export default LayoutWrapper;
