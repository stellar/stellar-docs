import React from "react";
import { MethodTable } from "./MethodTable";
import Translate from "@docusaurus/Translate";

const transledEndpoints = (
  <Translate
    id='components.EndpointsTable.Endpoints'
    description="The default title for a table of API endpoints">
    Endpoints
  </Translate>
)

export const EndpointsTable = ({ children, title = transledEndpoints }) => (
  <MethodTable title={title}>{children}</MethodTable>
);
