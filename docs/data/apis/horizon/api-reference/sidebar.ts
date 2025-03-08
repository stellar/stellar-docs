import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "category",
      label: "Resources",
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "data/apis/horizon/api-reference/horizon",
        },
        {
          type: "category",
          label: "Accounts",
          items: [
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/list-all-accounts",
              label: "List all Accounts",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/retrieve-an-account",
              label: "Retrieve an Account",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/get-transactions-by-account-id",
              label: "Retrieve an Account's Transactions",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/get-operations-by-account-id",
              label: "Retrieve an Account's Operations",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/get-payments-by-account-id",
              label: "Retrieve an Account's Payments",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/get-effects-by-account-id",
              label: "Retrieve an Account's Effects",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/get-offers-by-account-id",
              label: "Retrieve an Account's Offers",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/get-trades-by-account-id",
              label: "Retrieve an Account's Trades",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/get-data-by-account-id",
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
              id: "data/apis/horizon/api-reference/list-all-assets",
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
              id: "data/apis/horizon/api-reference/list-all-claimable-balances",
              label: "List All Claimable Balances",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/retrieve-a-claimable-balance",
              label: "Retrieve a Claimable Balance",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/cb-retrieve-related-transactions",
              label: "Retrieve Related Transactions",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/cb-retrieve-related-operations",
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
              id: "data/apis/horizon/api-reference/list-all-effects",
              label: "List All Effects",
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
              id: "data/apis/horizon/api-reference/list-liquidity-pools",
              label: "List Liquidity Pools",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/retrieve-a-liquidity-pool",
              label: "Retrieve a Liquidity Pool",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/retrieve-related-effects",
              label: "Retrieve Related Effects",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/retrieve-related-trades",
              label: "Retrieve Related Trades",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/lp-retrieve-related-transactions",
              label: "Retrieve Related Transactions",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/lp-retrieve-related-operations",
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
              id: "data/apis/horizon/api-reference/retrieve-a-ledger",
              label: "Retrieve a Ledger",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/retrieve-a-ledgers-transactions",
              label: "Retrieve a Ledger's Transactions",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/retrieve-a-ledgers-payments",
              label: "Retrieve a Ledger's Payments",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/retrieve-a-ledgers-operations",
              label: "Retrieve a Ledger's Operations",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/retrieve-a-ledgers-effects",
              label: "Retrieve a Ledgers's Effects",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/list-all-ledgers",
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
              id: "data/apis/horizon/api-reference/get-all-offers",
              label: "List All Offers",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/get-offer-by-offer-id",
              label: "Retrieve an Offer",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/get-trades-by-offer-id",
              label: "Retrieve an Offer's Trades",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Operations",
          items: [
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/retrieve-an-operation",
              label: "Retrieve an Operation",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/retrieve-an-operations-effects",
              label: "Retrieve an Operation's Effects",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/list-all-operations",
              label: "List All Operations",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Payments",
          items: [
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/list-all-payments",
              label: "List All Payments",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/retrieve-a-transactions-payments",
              label: "Retrieve a Transaction's Payments",
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
              id: "data/apis/horizon/api-reference/get-all-trades",
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
              id: "data/apis/horizon/api-reference/retrieve-a-transaction",
              label: "Retrieve a Transaction",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/retrieve-a-transactions-operations",
              label: "Retrieve a Transaction's Operations",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/retrieve-a-transactions-effects",
              label: "Retrieve a Transaction's Effects",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/list-all-transactions",
              label: "List All Transactions",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/submit-a-transaction",
              label: "Submit a Transaction",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/submit-async-transaction",
              label: "Submit a Transaction Asynchronously",
              className: "api-method post",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Aggregations",
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "data/apis/horizon/api-reference/horizon",
        },
        {
          type: "category",
          label: "Fee Stats",
          items: [
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/retrieve-fee-stats",
              label: "Retrieve Fee Stats",
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
              id: "data/apis/horizon/api-reference/retrieve-an-order-book",
              label: "Retrieve an Order Book",
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
              id: "data/apis/horizon/api-reference/list-strict-receive-payment-paths",
              label: "List Strict Receive Payment Paths",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "data/apis/horizon/api-reference/list-strict-send-payment-paths",
              label: "List Strict Send Payment Paths",
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
              id: "data/apis/horizon/api-reference/list-trade-aggregations",
              label: "List Trade Aggregations",
              className: "api-method get",
            },
          ],
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
