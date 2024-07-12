import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "anchor-platform/api-reference/callbacks/synchronous-callbacks-api",
    },
    {
      type: "category",
      label: "Unique Address",
      items: [
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/gen-address",
          label: "Generate Unique Address",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Fees",
      items: [
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/get-fee",
          label: "Retrieve Fees",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Rates",
      items: [
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/get-rates",
          label: "Retrieve Rates",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Customers",
      items: [
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/get-customer",
          label: "Retrieve Customer's Info",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/put-customer",
          label: "Create or Update Customer Info",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/del-customer",
          label: "Delete Customer Data",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "SEP-31",
      items: [
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/gen-address",
          label: "Generate Unique Address",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/get-fee",
          label: "Retrieve Fees",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/get-rates",
          label: "Retrieve Rates",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/get-customer",
          label: "Retrieve Customer's Info",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/put-customer",
          label: "Create or Update Customer Info",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/del-customer",
          label: "Delete Customer Data",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/post-event",
          label: "Receive an Event",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "SEP-38",
      items: [
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/get-rates",
          label: "Retrieve Rates",
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
          id: "anchor-platform/api-reference/callbacks/get-customer",
          label: "Retrieve Customer's Info",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/put-customer",
          label: "Create or Update Customer Info",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/post-event",
          label: "Receive an Event",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "SEP-12",
      items: [
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/get-customer",
          label: "Retrieve Customer's Info",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/put-customer",
          label: "Create or Update Customer Info",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/del-customer",
          label: "Delete Customer Data",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "SEP-24",
      items: [
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/put-customer",
          label: "Create or Update Customer Info",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/post-event",
          label: "Receive an Event",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Events",
      items: [
        {
          type: "doc",
          id: "anchor-platform/api-reference/callbacks/post-event",
          label: "Receive an Event",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
