import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "anchor-platform/api-reference/platform/platform-api",
    },
    {
      type: "category",
      label: "Transactions",
      link: {
        type: "doc",
        id: "anchor-platform/api-reference/platform/transactions",
      },
      items: [
        {
          type: "doc",
          id: "anchor-platform/api-reference/platform/get-transactions",
          label: "Retrieve a List of Transactions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/platform/get-transaction",
          label: "Retrieve a Transaction",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
