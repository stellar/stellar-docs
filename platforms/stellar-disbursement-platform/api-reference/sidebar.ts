import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api-reference/stellar-disbursement-platform-api",
    },
    {
      type: "category",
      label: "Admin (Tenant Management)",
      link: {
        type: "doc",
        id: "api-reference/admin",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/get-all-tenants",
          label: "Get All Tenants",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/create-tenant",
          label: "Create Tenant",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/retrieve-a-tenant",
          label: "Retrieve a Tenant",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/soft-delete-a-tenant",
          label: "Soft delete a Tenant",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api-reference/update-a-tenant",
          label: "Update a Tenant",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api-reference/default-tenant",
          label: "Default Tenant",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Authentication",
      link: {
        type: "doc",
        id: "api-reference/authentication",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/log-in",
          label: "Log In",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/refresh-token",
          label: "Refresh Token",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/authenticate-mfa",
          label: "Provide Multi-Factor Authentication",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/forgot-password",
          label: "Forgot Password",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/reset-password",
          label: "Reset Rassword",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Balances",
      link: {
        type: "doc",
        id: "api-reference/balances",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/get-organization-circle-balances",
          label: "Get Organization (Circle) Balances",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Disbursements",
      link: {
        type: "doc",
        id: "api-reference/disbursements",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/list-all-disbursements",
          label: "List All Disbursements",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/create-disbursement",
          label: "Create Disbursement",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/retrieve-a-disbursement",
          label: "Retrieve a Disbursement",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/list-all-disbursement-receivers",
          label: "List All Disbursement Receivers",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/download-disbursement-instructions",
          label: "Download Disbursement Instructions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/upload-disbursement-instructions",
          label: "Upload Disbursement Instructions",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/update-a-disbursement-status",
          label: "Update a Disbursement Status",
          className: "api-method patch",
        },
      ],
    },
    {
      type: "category",
      label: "Organization",
      link: {
        type: "doc",
        id: "api-reference/organization",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/get-organization-info",
          label: "Get Organization Info",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/update-organization-profile",
          label: "Update Organization Profile",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api-reference/get-organization-logo",
          label: "Retrieve Organization Logo",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/patch-organization-circle",
          label: "Circle Account Setup",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api-reference/get-all-countries",
          label: "Get All Countries",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/get-all-assets",
          label: "Get All Assets",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/create-asset",
          label: "Create Asset",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/delete-asset",
          label: "Delete Asset",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api-reference/get-all-wallets",
          label: "Get All Wallets",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Payments",
      link: {
        type: "doc",
        id: "api-reference/payments",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/list-all-payments",
          label: "List All Payments",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/retrieve-a-payment",
          label: "Retrieve a Payment",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Profile",
      link: {
        type: "doc",
        id: "api-reference/profile",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/get-profile",
          label: "Get Profile",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/update-user-profile",
          label: "Update User Profile",
          className: "api-method patch",
        },
      ],
    },
    {
      type: "category",
      label: "Receivers",
      link: {
        type: "doc",
        id: "api-reference/receivers",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/list-all-receivers",
          label: "List All Receivers",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/retrieve-a-receiver",
          label: "Retrieve a Receiver",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/update-a-receiver",
          label: "Update a Receiver",
          className: "api-method patch",
        },
      ],
    },
    {
      type: "category",
      label: "Registration",
      link: {
        type: "doc",
        id: "api-reference/registration",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/start-wallet-registration",
          label: "Start Wallet Registration",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/send-one-time-passcode",
          label: "Send One-Time Passcode",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/verify-receiver-registration",
          label: "Verify Receiver Registration",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/retrieve-stellar-info-file",
          label: "Retrieve Stellar Info File",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/request-challenge-transaction",
          label: "Request Challenge Transaction",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/provide-signed-challenge-transaction",
          label: "Provide Signed Challenge Transaction",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/request-registration-url",
          label: "Request Registration URL",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Statistics",
      link: {
        type: "doc",
        id: "api-reference/statistics",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/retrieve-all-statistics",
          label: "Retrieve All Statistics",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/retrieve-disbursement-statistics",
          label: "Retrieve Disbursement Statistics",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Users",
      link: {
        type: "doc",
        id: "api-reference/users",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/get-all-users",
          label: "Get All Users",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/create-user",
          label: "Create User",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/update-user-activation-status",
          label: "Update User Activation Status",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api-reference/get-all-roles",
          label: "Get All Roles",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/update-user-role",
          label: "Update User Role",
          className: "api-method patch",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
