import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";
const sidebar: SidebarsConfig = {
  apisidebar: [{
    type: "categoría",
    label: "Recursos",
    collapsible: true,
    collapsed: true,
    items: [{
      type: "doc",
      id: "data/apis/horizon/api-reference/horizon"
    }, {
      type: "categoría",
      label: "Cuentas",
      items: [{
        type: "doc",
        id: "data/apis/horizon/api-reference/list-all-accounts",
        label: "Listar todas las Cuentas",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/retrieve-an-account",
        label: "Recuperar una Cuenta",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/get-transactions-by-account-id",
        label: "Recuperar las Transacciones de una Cuenta",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/get-operations-by-account-id",
        label: "Recuperar las Operaciones de una Cuenta",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/get-payments-by-account-id",
        label: "Recuperar los Pagos de una Cuenta",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/get-effects-by-account-id",
        label: "Recuperar los Efectos de una Cuenta",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/get-offers-by-account-id",
        label: "Recuperar las Ofertas de una Cuenta",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/get-trades-by-account-id",
        label: "Recuperar las Negociaciones de una Cuenta",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/get-data-by-account-id",
        label: "Recuperar los Datos de una Cuenta",
        className: "api-método get"
      }]
    }, {
      type: "categoría",
      label: "Activos",
      items: [{
        type: "doc",
        id: "data/apis/horizon/api-reference/list-all-assets",
        label: "Listar todos los Activos",
        className: "api-método get"
      }]
    }, {
      type: "categoría",
      label: "Balances Dignos de Reclamo",
      items: [{
        type: "doc",
        id: "data/apis/horizon/api-reference/list-all-claimable-balances",
        label: "Listar Todos los Balances Dignos de Reclamo",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/retrieve-a-claimable-balance",
        label: "Recuperar un Balance Digno de Reclamo",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/cb-retrieve-related-transactions",
        label: "Recuperar Transacciones Relacionadas",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/cb-retrieve-related-operations",
        label: "Recuperar Operaciones Relacionadas",
        className: "api-método get"
      }]
    }, {
      type: "categoría",
      label: "Efectos",
      items: [{
        type: "doc",
        id: "data/apis/horizon/api-reference/list-all-effects",
        label: "Listar Todos los Efectos",
        className: "api-método get"
      }]
    }, {
      type: "categoría",
      label: "Fondos de Liquidez",
      items: [{
        type: "doc",
        id: "data/apis/horizon/api-reference/list-liquidity-pools",
        label: "Listar Fondos de Liquidez",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/retrieve-a-liquidity-pool",
        label: "Recuperar un Fondo de Liquidez",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/retrieve-related-effects",
        label: "Recuperar Efectos Relacionados",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/retrieve-related-trades",
        label: "Recuperar Negociaciones Relacionadas",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/lp-retrieve-related-transactions",
        label: "Recuperar Transacciones Relacionadas",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/lp-retrieve-related-operations",
        label: "Recuperar Operaciones Relacionadas",
        className: "api-método get"
      }]
    }, {
      type: "categoría",
      label: "Leds",
      items: [{
        type: "doc",
        id: "data/apis/horizon/api-reference/retrieve-a-ledger",
        label: "Recuperar un Ledger",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/retrieve-a-ledgers-transactions",
        label: "Recuperar las Transacciones de un Ledger",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/retrieve-a-ledgers-payments",
        label: "Recuperar los Pagos de un Ledger",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/retrieve-a-ledgers-operations",
        label: "Recuperar las Operaciones de un Ledger",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/retrieve-a-ledgers-effects",
        label: "Recuperar los Efectos de un Ledger",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/list-all-ledgers",
        label: "Listar Todos los Ledgers",
        className: "api-método get"
      }]
    }, {
      type: "categoría",
      label: "Ofertas",
      items: [{
        type: "doc",
        id: "data/apis/horizon/api-reference/get-all-offers",
        label: "Listar Todas las Ofertas",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/get-offer-by-offer-id",
        label: "Recuperar una Oferta",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/get-trades-by-offer-id",
        label: "Recuperar las Negociaciones de una Oferta",
        className: "api-método get"
      }]
    }, {
      type: "categoría",
      label: "Operaciones",
      items: [{
        type: "doc",
        id: "data/apis/horizon/api-reference/retrieve-an-operation",
        label: "Recuperar una Operación",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/retrieve-an-operations-effects",
        label: "Recuperar los Efectos de una Operación",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/list-all-operations",
        label: "Listar Todas las Operaciones",
        className: "api-método get"
      }]
    }, {
      type: "categoría",
      label: "Pagos",
      items: [{
        type: "doc",
        id: "data/apis/horizon/api-reference/list-all-payments",
        label: "Listar Todos los Pagos",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/retrieve-a-transactions-payments",
        label: "Recuperar los Pagos de una Transacción",
        className: "api-método get"
      }]
    }, {
      type: "categoría",
      label: "Negociaciones",
      items: [{
        type: "doc",
        id: "data/apis/horizon/api-reference/get-all-trades",
        label: "Listar Todas las Negociaciones",
        className: "api-método get"
      }]
    }, {
      type: "categoría",
      label: "Transacciones",
      items: [{
        type: "doc",
        id: "data/apis/horizon/api-reference/retrieve-a-transaction",
        label: "Recuperar una Transacción",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/retrieve-a-transactions-operations",
        label: "Recuperar las Operaciones de una Transacción",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/retrieve-a-transactions-effects",
        label: "Recuperar los Efectos de una Transacción",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/list-all-transactions",
        label: "Listar Todas las Transacciones",
        className: "api-método get"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/submit-a-transaction",
        label: "Enviar una Transacción",
        className: "api-método post"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/submit-async-transaction",
        label: "Enviar una Transacción Asincrónicamente",
        className: "api-método post"
      }]
    }]
  }, {
    type: "categoría",
    label: "Agregaciones",
    collapsible: true,
    collapsed: true,
    items: [{
      type: "doc",
      id: "data/apis/horizon/api-reference/horizon"
    }, {
      type: "categoría",
      label: "Estadísticas de Tarifas",
      items: [{
        type: "doc",
        id: "data/apis/horizon/api-reference/retrieve-fee-stats",
        label: "Recuperar Estadísticas de Tarifas",
        className: "api-método get"
      }]
    }, {
      type: "categoría",
      label: "Libros de Órdenes",
      items: [{
        type: "doc",
        id: "data/apis/horizon/api-reference/retrieve-an-order-book",
        label: "Recuperar un Libro de Órdenes",
        className: "método-api obtener"
      }]
    }, {
      type: "categoría",
      label: "Rutas",
      items: [{
        type: "doc",
        id: "data/apis/horizon/api-reference/list-strict-receive-payment-paths",
        label: "Listar rutas de pago de recepción estricta",
        className: "método-api obtener"
      }, {
        type: "doc",
        id: "data/apis/horizon/api-reference/list-strict-send-payment-paths",
        label: "Listar rutas de pago de envío estrictas",
        className: "método-api obtener"
      }]
    }, {
      type: "categoría",
      label: "Agregaciones de comercio",
      items: [{
        type: "doc",
        id: "data/apis/horizon/api-reference/list-trade-aggregations",
        label: "Listar agregaciones de comercio",
        className: "método-api obtener"
      }]
    }]
  }]
};
export default sidebar.apisidebar;