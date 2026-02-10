import React, { type ReactNode } from "react";
import clsx from "clsx";

import { partition } from "@site/src/helpers";

const RIGHT_COLUMN_COMPONENTS_NAME = {
  CodeExample: "CodeExample",
  EndpointsTable: "EndpointsTable",
  ExampleResponse: "ExampleResponse",
  MethodTable: "MethodTable",
  table: "table",
};

export function WrapperApiReference({ children, ...props }): ReactNode {
  const [rightColumnContent, middleColumnContent] = React.useMemo(
    () =>
      partition(
        React.Children.toArray(children),
        (child) => RIGHT_COLUMN_COMPONENTS_NAME[child.props.mdxType],
      ),
    [children],
  );

  const hasRightColumn = rightColumnContent.length > 0;

  return (
    <div className="row">
      <div className={clsx("col", hasRightColumn && "col--7")} {...props}>
        {middleColumnContent}
      </div>

      {hasRightColumn && (
        <aside className="col col--5">{rightColumnContent}</aside>
      )}
    </div>
  );
};
