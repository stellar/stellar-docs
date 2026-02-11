import React, { type ReactNode } from "react";
import { MethodTable } from "./MethodTable";
import Translate from "@docusaurus/Translate";

const transledEndpoints = (
  <Translate
    id='components.EndpointsTable.Endpoints'
    description="The default title for a table of API endpoints">
    Endpoints
  </Translate>
)

export function EndpointsTable({ children, title = transledEndpoints }): ReactNode {
  return (
    <MethodTable title={title}>{children}</MethodTable>
  );
};
