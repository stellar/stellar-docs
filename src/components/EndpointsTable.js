import React from "react";
import { MethodTable } from "./MethodTable";

export const EndpointsTable = ({ children, title = "Endpoints" }) => (
  <MethodTable title={title}>{children}</MethodTable>
);
