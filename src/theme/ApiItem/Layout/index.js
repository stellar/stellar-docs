import React from "react";
import { MDXProvider } from "@mdx-js/react";
import Layout from "@theme-original/ApiItem/Layout";
// import DocItem from "@theme-original/DocItem";
import { useDoc } from "@docusaurus/theme-common/internal";

import { WrapperApiReference } from "@site/src/components/WrapperApiReference";

import styles from "./styles.module.scss";

const LayoutWrapper = (props) => {
  const {
    frontMatter: { api },
  } = useDoc();

  const layout = (
    <div className={styles.LayoutWrapper}>
      <Layout {...props} />
    </div>
  );

  if (api) {
    return layout;
  }

  return (
    <MDXProvider components={{ wrapper: WrapperApiReference }}>
      {layout}
    </MDXProvider>
  );
};

export default LayoutWrapper;
