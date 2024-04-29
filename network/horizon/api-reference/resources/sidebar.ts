import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "horizon/api-reference/resources/horizon",
    },
    {
      type: "category",
      label: "Accounts",
      items: [
        {
          type: "doc",
          id: "horizon/api-reference/resources/list-all-accounts",
          label: "List all Accounts",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/retrieve-an-account",
          label: "Retrieve an Account",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/get-transactions-by-account-id",
          label: "Retrieve an Account's Transactions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/get-operations-by-account-id",
          label: "Retrieve an Account's Operations",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/get-payments-by-account-id",
          label: "Retrieve an Account's Payments",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/get-effects-by-account-id",
          label: "Retrieve an Account's Effects",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/get-offers-by-account-id",
          label: "Retrieve an Account's Offers",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/get-trades-by-account-id",
          label: "Retrieve an Account's Trades",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/get-data-by-account-id",
          label: "Retrieve an Account's Data",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Assets",
      items: [
        {
          type: "doc",
          id: "horizon/api-reference/resources/list-all-assets",
          label: "List all Assets",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Claimable Balances",
      items: [
        {
          type: "doc",
          id: "horizon/api-reference/resources/list-all-claimable-balances",
          label: "List All Claimable Balances",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/retrieve-a-claimable-balance",
          label: "Retrieve a Claimable Balance",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/cb-retrieve-related-transactions",
          label: "Retrieve Related Transactions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/cb-retrieve-related-operations",
          label: "Retrieve Related Operations",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Effects",
      items: [
        {
          type: "doc",
          id: "horizon/api-reference/resources/list-all-effects",
          label: "List All Effects",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Fee Stats",
      items: [
        {
          type: "doc",
          id: "horizon/api-reference/resources/retrieve-fee-stats",
          label: "Retrieve Fee Stats",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Liquidity Pools",
      items: [
        {
          type: "doc",
          id: "horizon/api-reference/resources/list-liquidity-pools",
          label: "List Liquidity Pools",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/retrieve-a-liquidity-pool",
          label: "Retrieve a Liquidity Pool",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/retrieve-related-effects",
          label: "Retrieve Related Effects",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/retrieve-related-trades",
          label: "Retrieve Related Trades",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/lp-retrieve-related-transactions",
          label: "Retrieve Related Transactions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/lp-retrieve-related-operations",
          label: "Retrieve Related Operations",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Ledgers",
      items: [
        {
          type: "doc",
          id: "horizon/api-reference/resources/retrieve-a-ledger",
          label: "Retrieve a Ledger",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/retrieve-a-ledgers-transactions",
          label: "Retrieve a Ledger's Transactions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/retrieve-a-ledgers-payments",
          label: "Retrieve a Ledger's Payments",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/retrieve-a-ledgers-operations",
          label: "Retrieve a Ledger's Operations",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/retrieve-a-ledgers-effects",
          label: "Retrieve a Ledgers's Effects",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/list-all-ledgers",
          label: "List All Ledgers",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Offers",
      items: [
        {
          type: "doc",
          id: "horizon/api-reference/resources/get-all-offers",
          label: "List All Offers",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/get-offer-by-offer-id",
          label: "Retrieve an Offer",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/get-trades-by-offer-id",
          label: "Retrieve an Offer's Trades",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Order Books",
      items: [
        {
          type: "doc",
          id: "horizon/api-reference/resources/retrieve-an-order-book",
          label: "Retrieve an Order Book",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Trade Aggregations",
      items: [
        {
          type: "doc",
          id: "horizon/api-reference/resources/list-trade-aggregations",
          label: "List Trade Aggregations",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Trades",
      items: [
        {
          type: "doc",
          id: "horizon/api-reference/resources/get-all-trades",
          label: "List All Trades",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Transactions",
      items: [
        {
          type: "doc",
          id: "horizon/api-reference/resources/retrieve-a-transaction",
          label: "Retrieve a Transaction",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/retrieve-a-transactions-operations",
          label: "Retrieve a Transaction's Operations",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/retrieve-a-transactions-effects",
          label: "Retrieve a Transaction's Effects",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/list-all-transactions",
          label: "List All Transactions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/submit-a-transaction",
          label: "Submit a Transaction",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Operations",
      items: [
        {
          type: "doc",
          id: "horizon/api-reference/resources/retrieve-an-operation",
          label: "Retrieve an Operation",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/retrieve-an-operations-effects",
          label: "Retrieve an Operation's Effects",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/list-all-operations",
          label: "List All Operations",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/list-all-payments",
          label: "List All Payments",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Paths",
      items: [
        {
          type: "doc",
          id: "horizon/api-reference/resources/list-strict-receive-payment-paths",
          label: "List Strict Receive Payment Paths",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "horizon/api-reference/resources/list-strict-send-payment-paths",
          label: "List Strict Send Payment Paths",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
