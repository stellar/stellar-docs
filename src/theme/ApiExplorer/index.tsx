import React, { type ReactNode } from 'react';
import ApiExplorer from '@theme-original/ApiExplorer';
import Admonition from "@theme/Admonition";
import Link from "@docusaurus/Link";

import type ApiExplorerType from '@theme-original/ApiExplorer';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof ApiExplorerType>;

export default function ApiExplorerWrapper(props: Props): ReactNode {
  return (
    <>
      <ApiExplorer {...props} />

      {props?.item?.["x-supports-streaming"] && (
        <Admonition type="tip" title="Supports Streaming">
          This endpoint supports streaming. To read more about this, visit the
          <Link className="padding-horiz--xs" to="/docs/data/apis/horizon/api-reference/structure/streaming">
            streaming section.
          </Link>
        </Admonition>
      )}
    </>
  );
}
