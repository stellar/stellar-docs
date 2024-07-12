import React from "react";
import MDXComponents from "@theme-original/MDXComponents";

import { CodeExample } from '@site/src/components/CodeExample';
import { EndpointsTable } from '@site/src/components/EndpointsTable';
import { AttributeTable } from '@site/src/components/AttributeTable';

export default {
  ...MDXComponents,
  AttributeTable,
  CodeExample,
  EndpointsTable,
};
