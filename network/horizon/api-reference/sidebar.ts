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
          id: "horizon/api-reference/horizon",
        },
        {
          type: "category",
          label: "Accounts",
          link: {
            type: "doc",
            id: "horizon/api-reference/accounts",
          },
          items: [
            {
              type: "doc",
              id: "horizon/api-reference/list-all-accounts",
              label: "List all Accounts",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/retrieve-an-account",
              label: "Retrieve an Account",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/get-transactions-by-account-id",
              label: "Retrieve an Account's Transactions",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/get-operations-by-account-id",
              label: "Retrieve an Account's Operations",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/get-payments-by-account-id",
              label: "Retrieve an Account's Payments",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/get-effects-by-account-id",
              label: "Retrieve an Account's Effects",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/get-offers-by-account-id",
              label: "Retrieve an Account's Offers",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/get-trades-by-account-id",
              label: "Retrieve an Account's Trades",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/get-data-by-account-id",
              label: "Retrieve an Account's Data",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Assets",
          link: {
            type: "doc",
            id: "horizon/api-reference/assets",
          },
          items: [
            {
              type: "doc",
              id: "horizon/api-reference/list-all-assets",
              label: "List all Assets",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Claimable Balances",
          link: {
            type: "doc",
            id: "horizon/api-reference/claimable-balances",
          },
          items: [
            {
              type: "doc",
              id: "horizon/api-reference/list-all-claimable-balances",
              label: "List All Claimable Balances",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/retrieve-a-claimable-balance",
              label: "Retrieve a Claimable Balance",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/cb-retrieve-related-transactions",
              label: "Retrieve Related Transactions",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/cb-retrieve-related-operations",
              label: "Retrieve Related Operations",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Effects",
          link: {
            type: "doc",
            id: "horizon/api-reference/effects",
          },
          items: [
            {
              type: "doc",
              id: "horizon/api-reference/list-all-effects",
              label: "List All Effects",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Liquidity Pools",
          link: {
            type: "doc",
            id: "horizon/api-reference/liquidity-pools",
          },
          items: [
            {
              type: "doc",
              id: "horizon/api-reference/list-liquidity-pools",
              label: "List Liquidity Pools",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/retrieve-a-liquidity-pool",
              label: "Retrieve a Liquidity Pool",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/retrieve-related-effects",
              label: "Retrieve Related Effects",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/retrieve-related-trades",
              label: "Retrieve Related Trades",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/lp-retrieve-related-transactions",
              label: "Retrieve Related Transactions",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/lp-retrieve-related-operations",
              label: "Retrieve Related Operations",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Ledgers",
          link: {
            type: "doc",
            id: "horizon/api-reference/ledgers",
          },
          items: [
            {
              type: "doc",
              id: "horizon/api-reference/retrieve-a-ledger",
              label: "Retrieve a Ledger",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/retrieve-a-ledgers-transactions",
              label: "Retrieve a Ledger's Transactions",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/retrieve-a-ledgers-payments",
              label: "Retrieve a Ledger's Payments",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/retrieve-a-ledgers-operations",
              label: "Retrieve a Ledger's Operations",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/retrieve-a-ledgers-effects",
              label: "Retrieve a Ledgers's Effects",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/list-all-ledgers",
              label: "List All Ledgers",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Offers",
          link: {
            type: "doc",
            id: "horizon/api-reference/offers",
          },
          items: [
            {
              type: "doc",
              id: "horizon/api-reference/get-all-offers",
              label: "List All Offers",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/get-offer-by-offer-id",
              label: "Retrieve an Offer",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/get-trades-by-offer-id",
              label: "Retrieve an Offer's Trades",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Operations",
          link: {
            type: "doc",
            id: "horizon/api-reference/operations",
          },
          items: [
            {
              type: "doc",
              id: "horizon/api-reference/retrieve-an-operation",
              label: "Retrieve an Operation",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/retrieve-an-operations-effects",
              label: "Retrieve an Operation's Effects",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/list-all-operations",
              label: "List All Operations",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/list-all-payments",
              label: "List All Payments",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Trades",
          link: {
            type: "doc",
            id: "horizon/api-reference/trades",
          },
          items: [
            {
              type: "doc",
              id: "horizon/api-reference/get-all-trades",
              label: "List All Trades",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Transactions",
          link: {
            type: "doc",
            id: "horizon/api-reference/transactions",
          },
          items: [
            {
              type: "doc",
              id: "horizon/api-reference/retrieve-a-transaction",
              label: "Retrieve a Transaction",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/retrieve-a-transactions-operations",
              label: "Retrieve a Transaction's Operations",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/retrieve-a-transactions-effects",
              label: "Retrieve a Transaction's Effects",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/list-all-transactions",
              label: "List All Transactions",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/submit-a-transaction",
              label: "Submit a Transaction",
              className: "api-method post",
            },
          ],
        },
        {
          type: "category",
          label: "Schemas",
          items: [
            {
              type: "doc",
              id: "horizon/api-reference/schemas/accident",
              label: "Accident",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/link",
              label: "link",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/links",
              label: "Links",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/id",
              label: "id",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/address",
              label: "address",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/sequence",
              label: "sequence",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/sequence-ledger",
              label: "sequence_ledger",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/subentry-count",
              label: "subentry_count",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/last-modified-ledger",
              label: "last_modified_ledger",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/thresholds",
              label: "thresholds",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/flags",
              label: "flags",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/currency",
              label: "currency",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/balancelinenative",
              label: "BalanceLineNative",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/balancelineasset",
              label: "BalanceLineAsset",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/balancelineliquiditypool",
              label: "BalanceLineLiquidityPool",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/signers",
              label: "signers",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/account",
              label: "Account",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/signatures",
              label: "signatures",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/transactionpreconditionstimebounds",
              label: "TransactionPreconditionsTimebounds",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/transactionpreconditionsledgerbounds",
              label: "TransactionPreconditionsLedgerbounds",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/transactionpreconditions",
              label: "TransactionPreconditions",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/hash",
              label: "hash",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/feebumptransaction",
              label: "FeeBumpTransaction",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/innertransaction",
              label: "InnerTransaction",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/transaction",
              label: "Transaction",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/createaccount",
              label: "CreateAccount",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/payment",
              label: "Payment",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/pathpaymentstrictreceive",
              label: "PathPaymentStrictReceive",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/pathpaymentstrictsend",
              label: "PathPaymentStrictSend",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/accountmerge",
              label: "AccountMerge",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/baseasset",
              label: "BaseAsset",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/price",
              label: "Price",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/offer",
              label: "Offer",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/paging-token",
              label: "paging_token",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/tradeprice",
              label: "tradePrice",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/trade",
              label: "Trade",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/asset",
              label: "Asset",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/claimablebalances",
              label: "ClaimableBalances",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/claimablebalance",
              label: "ClaimableBalance",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/effect",
              label: "Effect",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/feedistribution",
              label: "FeeDistribution",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/feestats",
              label: "FeeStats",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/ledger",
              label: "Ledger",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/operation",
              label: "Operation",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/liquiditypools",
              label: "LiquidityPools",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/liquiditypool",
              label: "LiquidityPool",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/orderbook",
              label: "OrderBook",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/schemas-asset",
              label: "schemas-Asset",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/path",
              label: "Path",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/tradeaggregation",
              label: "TradeAggregation",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/schemas-transaction",
              label: "schemas-Transaction",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/submittransaction",
              label: "SubmitTransaction",
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
          id: "horizon/api-reference/horizon",
        },
        {
          type: "category",
          label: "Fee Stats",
          link: {
            type: "doc",
            id: "horizon/api-reference/fee-stats",
          },
          items: [
            {
              type: "doc",
              id: "horizon/api-reference/retrieve-fee-stats",
              label: "Retrieve Fee Stats",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Order Books",
          link: {
            type: "doc",
            id: "horizon/api-reference/order-books",
          },
          items: [
            {
              type: "doc",
              id: "horizon/api-reference/retrieve-an-order-book",
              label: "Retrieve an Order Book",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Paths",
          link: {
            type: "doc",
            id: "horizon/api-reference/paths",
          },
          items: [
            {
              type: "doc",
              id: "horizon/api-reference/list-strict-receive-payment-paths",
              label: "List Strict Receive Payment Paths",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "horizon/api-reference/list-strict-send-payment-paths",
              label: "List Strict Send Payment Paths",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Trade Aggregations",
          link: {
            type: "doc",
            id: "horizon/api-reference/trade-aggregations",
          },
          items: [
            {
              type: "doc",
              id: "horizon/api-reference/list-trade-aggregations",
              label: "List Trade Aggregations",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Schemas",
          items: [
            {
              type: "doc",
              id: "horizon/api-reference/schemas/accident",
              label: "Accident",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/link",
              label: "link",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/links",
              label: "Links",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/id",
              label: "id",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/address",
              label: "address",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/sequence",
              label: "sequence",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/sequence-ledger",
              label: "sequence_ledger",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/subentry-count",
              label: "subentry_count",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/last-modified-ledger",
              label: "last_modified_ledger",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/thresholds",
              label: "thresholds",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/flags",
              label: "flags",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/currency",
              label: "currency",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/balancelinenative",
              label: "BalanceLineNative",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/balancelineasset",
              label: "BalanceLineAsset",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/balancelineliquiditypool",
              label: "BalanceLineLiquidityPool",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/signers",
              label: "signers",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/account",
              label: "Account",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/signatures",
              label: "signatures",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/transactionpreconditionstimebounds",
              label: "TransactionPreconditionsTimebounds",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/transactionpreconditionsledgerbounds",
              label: "TransactionPreconditionsLedgerbounds",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/transactionpreconditions",
              label: "TransactionPreconditions",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/hash",
              label: "hash",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/feebumptransaction",
              label: "FeeBumpTransaction",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/innertransaction",
              label: "InnerTransaction",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/transaction",
              label: "Transaction",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/createaccount",
              label: "CreateAccount",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/payment",
              label: "Payment",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/pathpaymentstrictreceive",
              label: "PathPaymentStrictReceive",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/pathpaymentstrictsend",
              label: "PathPaymentStrictSend",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/accountmerge",
              label: "AccountMerge",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/baseasset",
              label: "BaseAsset",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/price",
              label: "Price",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/offer",
              label: "Offer",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/paging-token",
              label: "paging_token",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/tradeprice",
              label: "tradePrice",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/trade",
              label: "Trade",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/asset",
              label: "Asset",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/claimablebalances",
              label: "ClaimableBalances",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/claimablebalance",
              label: "ClaimableBalance",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/effect",
              label: "Effect",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/feedistribution",
              label: "FeeDistribution",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/feestats",
              label: "FeeStats",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/ledger",
              label: "Ledger",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/operation",
              label: "Operation",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/liquiditypools",
              label: "LiquidityPools",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/liquiditypool",
              label: "LiquidityPool",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/orderbook",
              label: "OrderBook",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/schemas-asset",
              label: "schemas-Asset",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/path",
              label: "Path",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/tradeaggregation",
              label: "TradeAggregation",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/schemas-transaction",
              label: "schemas-Transaction",
            },
            {
              type: "doc",
              id: "horizon/api-reference/schemas/submittransaction",
              label: "SubmitTransaction",
            },
          ],
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
