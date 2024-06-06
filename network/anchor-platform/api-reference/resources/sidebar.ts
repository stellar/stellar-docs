import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "anchor-platform/api-reference/resources/platform-api",
    },
    {
      type: "category",
      label: "Transactions",
      items: [
        {
          type: "doc",
          id: "anchor-platform/api-reference/resources/get-transactions",
          label: "Retrieve a List of Transactions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/resources/get-transaction",
          label: "Retrieve a Transaction",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "SEP-6",
      items: [
        {
          type: "doc",
          id: "anchor-platform/api-reference/resources/get-transactions",
          label: "Retrieve a List of Transactions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/resources/get-transaction",
          label: "Retrieve a Transaction",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "SEP-24",
      items: [
        {
          type: "doc",
          id: "anchor-platform/api-reference/resources/get-transactions",
          label: "Retrieve a List of Transactions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/resources/get-transaction",
          label: "Retrieve a Transaction",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "SEP-31",
      items: [
        {
          type: "doc",
          id: "anchor-platform/api-reference/resources/get-transactions",
          label: "Retrieve a List of Transactions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/resources/get-transaction",
          label: "Retrieve a Transaction",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
