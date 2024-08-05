import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "anchor-platform/api-reference/anchor-platform",
    },
    {
      type: "category",
      label: "Transactions",
      link: {
        type: "doc",
        id: "anchor-platform/api-reference/transactions",
      },
      items: [
        {
          type: "doc",
          id: "anchor-platform/api-reference/get-transactions",
          label: "Retrieve a List of Transactions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/get-transaction",
          label: "Retrieve a Transaction",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Callbacks",
      link: {
        type: "doc",
        id: "anchor-platform/api-reference/callbacks",
      },
      items: [
        {
          type: "doc",
          id: "anchor-platform/api-reference/gen-address",
          label: "Generate Unique Address",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/get-fee",
          label: "Retrieve Fees",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/get-rates",
          label: "Retrieve Rates",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/get-customer",
          label: "Retrieve Customer's Info",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/put-customer",
          label: "Create or Update Customer Info",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/del-customer",
          label: "Delete Customer Data",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/post-event",
          label: "Receive an Event",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Custody Server",
      link: {
        type: "doc",
        id: "anchor-platform/api-reference/custody-server",
      },
      items: [
        {
          type: "doc",
          id: "anchor-platform/api-reference/create-custody-transaction",
          label: "Create Custody Transaction",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/send-payment",
          label: "Send Payment",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/send-refund",
          label: "Send Refund",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/generate-unique-address",
          label: "Generate Unique Address",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
