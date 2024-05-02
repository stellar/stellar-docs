import React from 'react';
import ApiExplorer from '@theme-original/ApiExplorer';
import Admonition from "@theme/Admonition";
import Link from "@docusaurus/Link";

export default function ApiExplorerWrapper(props) {
  console.log('api explorer wrapper props', props)
  return (
    <>
      <ApiExplorer {...props} />

      {props?.item?.["x-supports-streaming"] && (
        <Admonition type="tip" title="Supports Streaming">
          This endpoint supports streaming. To read more about this, visit the
          <Link className="padding-horiz--xs" to="/network/horizon/api-reference/structure/streaming">
            streaming section.
          </Link>
        </Admonition>
      )}
    </>
  );
}
