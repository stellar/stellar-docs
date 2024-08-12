import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "category",
      label: "Platform API",
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "anchor-platform/api-reference/zesty/platform-api",
        },
        {
          type: "category",
          label: "Transactions",
          link: {
            type: "doc",
            id: "anchor-platform/api-reference/zesty/transactions",
          },
          items: [
            {
              type: "doc",
              id: "anchor-platform/api-reference/zesty/get-transactions",
              label: "Retrieve a List of Transactions",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "anchor-platform/api-reference/zesty/get-transaction",
              label: "Retrieve a Transaction",
              className: "api-method get",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Synchronous Callbacks API",
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "anchor-platform/api-reference/zesty/platform-api",
        },
        {
          type: "category",
          label: "Unique Address",
          link: {
            type: "doc",
            id: "anchor-platform/api-reference/zesty/unique-address",
          },
          items: [
            {
              type: "doc",
              id: "anchor-platform/api-reference/zesty/gen-address",
              label: "Generate Unique Address",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Fees",
          link: {
            type: "doc",
            id: "anchor-platform/api-reference/zesty/fees",
          },
          items: [
            {
              type: "doc",
              id: "anchor-platform/api-reference/zesty/get-fee",
              label: "Retrieve Fees",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Rates",
          link: {
            type: "doc",
            id: "anchor-platform/api-reference/zesty/rates",
          },
          items: [
            {
              type: "doc",
              id: "anchor-platform/api-reference/zesty/get-rates",
              label: "Retrieve Rates",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Customers",
          link: {
            type: "doc",
            id: "anchor-platform/api-reference/zesty/customers",
          },
          items: [
            {
              type: "doc",
              id: "anchor-platform/api-reference/zesty/get-customer",
              label: "Retrieve Customer's Info",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "anchor-platform/api-reference/zesty/put-customer",
              label: "Create or Update Customer Info",
              className: "api-method put",
            },
            {
              type: "doc",
              id: "anchor-platform/api-reference/zesty/del-customer",
              label: "Delete Customer Data",
              className: "api-method delete",
            },
          ],
        },
        {
          type: "category",
          label: "Events",
          link: {
            type: "doc",
            id: "anchor-platform/api-reference/zesty/events",
          },
          items: [
            {
              type: "doc",
              id: "anchor-platform/api-reference/zesty/post-event",
              label: "Receive an Event",
              className: "api-method post",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Custody Server API",
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "anchor-platform/api-reference/zesty/platform-api",
        },
        {
          type: "category",
          label: "Custody Transactions",
          link: {
            type: "doc",
            id: "anchor-platform/api-reference/zesty/custody-transactions",
          },
          items: [
            {
              type: "doc",
              id: "anchor-platform/api-reference/zesty/create-custody-transaction",
              label: "Create Custody Transaction",
              className: "api-method post",
            },
          ],
        },
        {
          type: "category",
          label: "Payments",
          link: {
            type: "doc",
            id: "anchor-platform/api-reference/zesty/payments",
          },
          items: [
            {
              type: "doc",
              id: "anchor-platform/api-reference/zesty/send-payment",
              label: "Send Payment",
              className: "api-method post",
            },
          ],
        },
        {
          type: "category",
          label: "Refunds",
          link: {
            type: "doc",
            id: "anchor-platform/api-reference/zesty/refunds",
          },
          items: [
            {
              type: "doc",
              id: "anchor-platform/api-reference/zesty/send-refund",
              label: "Send Refund",
              className: "api-method post",
            },
          ],
        },
        {
          type: "category",
          label: "Custody Unique Address",
          link: {
            type: "doc",
            id: "anchor-platform/api-reference/zesty/custody-unique-address",
          },
          items: [
            {
              type: "doc",
              id: "anchor-platform/api-reference/zesty/generate-unique-address",
              label: "Generate Unique Address",
              className: "api-method post",
            },
          ],
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
