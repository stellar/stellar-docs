import React from "react";
import ApiDemoPanel from "@theme-original/ApiDemoPanel";
import Admonition from "@theme/Admonition";
import Link from "@docusaurus/Link";

export default function ApiDemoPanelWrapper(props) {
  return (
    <>
      <ApiDemoPanel {...props} />

      {props?.item?.["x-supports-streaming"] && (
        <Admonition type="tip" title="Supports Streaming">
          This endpoint supports streaming. To read more about this, visit the
          <Link className="padding-horiz--xs" to="/api/introduction/streaming">
            streaming section.
          </Link>
        </Admonition>
      )}
    </>
  );
}
