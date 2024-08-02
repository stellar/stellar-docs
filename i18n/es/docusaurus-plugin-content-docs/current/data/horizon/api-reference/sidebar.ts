import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";
const sidebar: SidebarsConfig = {
  apisidebar: [{
    type: "categoría",
    label: "Recursos",
    collapsible: true,
    collapsed: true,
    items: [{
      type: "doc",
      id: "datos/horizonte/api-referencia/horizonte"
    }, {
      type: "categoría",
      label: "Cuentas",
      items: [{
        type: "doc",
        id: "datos/horizon/api-reference/list-all-accounts",
        label: "Listar todas las cuentas",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/recuperar-un-cuenta",
        label: "Recuperar una cuenta",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/get-transactions-por-account-id",
        label: "Recuperar las transacciones de una cuenta",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizonte/api-reference/get-operations-por-account-id",
        label: "Recuperar las operaciones de una cuenta",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/get-payments-por-account-id",
        label: "Recuperar los pagos de una cuenta",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizonte/api-reference/get-efectos-por-cuenta-id",
        label: "Recuperar los efectos de una cuenta",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/get-offers-por-account-id",
        label: "Recuperar ofertas de una cuenta",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizonte/api-reference/get-trades-por-account-id",
        label: "Recuperar las operaciones de una cuenta",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizonte/api-reference/get-data-por-account-id",
        label: "Recuperar los datos de una cuenta",
        className: "Obtener el método api-method"
      }]
    }, {
      type: "categoría",
      label: "Activos",
      items: [{
        type: "doc",
        id: "datos/horizon/api-reference/list-all-assets",
        label: "Listar todos los recursos",
        className: "Obtener el método api-method"
      }]
    }, {
      type: "categoría",
      label: "Saldos reclamables",
      items: [{
        type: "doc",
        id: "datos/horizon/api-reference/list-all-claimable-balances",
        label: "Listar todos los saldos reclamables",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/recuperar-a-reclamable-balance",
        label: "Recuperar un saldo reclamable",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/cb-recuperar-transacciones-relacionadas-de-datos",
        label: "Recuperar transacciones relacionadas",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/cb-recuperar-operaciones-relacionadas-de-datos",
        label: "Recuperar operaciones relacionadas",
        className: "Obtener el método api-method"
      }]
    }, {
      type: "categoría",
      label: "Efectos",
      items: [{
        type: "doc",
        id: "datos/horizon/api-reference/list-all-effects",
        label: "Listar todos los efectos",
        className: "Obtener el método api-method"
      }]
    }, {
      type: "categoría",
      label: "Piscinas de liquidez",
      items: [{
        type: "doc",
        id: "datos/horizonte/api-reference/list-liquidity-pools",
        label: "Listar piscinas de liquidez",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizonte/api-reference/recuperar-a-líquida-pool",
        label: "Recuperar una herramienta de liquidez",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/recuperar-efectos-relacionados-de-datos",
        label: "Recuperar efectos relacionados",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizonte/api-reference/recuperar-relacionados-de-intercambio",
        label: "Recuperar operaciones relacionadas",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/lp-retrieve-related-transactions",
        label: "Recuperar transacciones relacionadas",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "data/horizon/api-reference/lp-retrieve-related operations",
        label: "Recuperar operaciones relacionadas",
        className: "Obtener el método api-method"
      }]
    }, {
      type: "categoría",
      label: "Ledgers",
      items: [{
        type: "doc",
        id: "datos/horizon/api-reference/recuperar-a-ledger",
        label: "Recuperar un Libro",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/retrieve-a-ledgers-transactions",
        label: "Recuperar transacciones de Ledger's",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "data/horizon/api-reference/retrieve-a-ledgers-payments",
        label: "Recuperar pagos de un Ledger's",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/retrieve-a-ledgers-operations",
        label: "Recuperar las operaciones de un Ledger",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/retrieve-a-ledgers-effects",
        label: "Recupera los efectos de un Ledger",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/list-all-ledgers",
        label: "Listar todos los Ledgers",
        className: "Obtener el método api-method"
      }]
    }, {
      type: "categoría",
      label: "Ofertas",
      items: [{
        type: "doc",
        id: "data/horizon/api-reference/get-all-offers",
        label: "Listar todas las ofertas",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/get-offer-by-offer-id",
        label: "Recuperar una oferta",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizonte/api-reference/get-trades-por-offer-id",
        label: "Recuperar las Ofertas",
        className: "Obtener el método api-method"
      }]
    }, {
      type: "categoría",
      label: "Operaciones",
      items: [{
        type: "doc",
        id: "datos/horizon/api-reference/recuperar-un-operación",
        label: "Recuperar una Operación",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/recuperar-un-operations-effects",
        label: "Recuperar los efectos de la operación",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/list-all-operations",
        label: "Listar todas las operaciones",
        className: "Obtener el método api-method"
      }]
    }, {
      type: "categoría",
      label: "Pagos",
      items: [{
        type: "doc",
        id: "datos/horizon/api-reference/list-all-payments",
        label: "Listar todos los pagos",
        className: "Obtener el método api-method"
      }]
    }, {
      type: "categoría",
      label: "Operaciones",
      items: [{
        type: "doc",
        id: "datos/horizonte/api-reference/get-all-trades",
        label: "Listar todas las operaciones",
        className: "Obtener el método api-method"
      }]
    }, {
      type: "categoría",
      label: "Transacciones",
      items: [{
        type: "doc",
        id: "datos/horizon/api-reference/recuperar una transacción",
        label: "Recuperar una transacción",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/retrieve-a-transactions-operations",
        label: "Recuperar las operaciones de una transacción",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/recuperar-a-efectos-transacciones-",
        label: "Recuperar los efectos de una transacción",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/list-all-transactions",
        label: "Listar todas las transacciones",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/submit-a-a-transaction",
        label: "Enviar una transacción",
        className: "api-method post"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/submit-async-transaction",
        label: "Enviar una transacción de forma asincrónica",
        className: "api-method post"
      }]
    }]
  }, {
    type: "categoría",
    label: "Agregaciones",
    collapsible: true,
    collapsed: true,
    items: [{
      type: "doc",
      id: "datos/horizonte/api-referencia/horizonte"
    }, {
      type: "categoría",
      label: "Estadísticas de comisión",
      items: [{
        type: "doc",
        id: "datos/horizon/api-reference/retrieve-fee-stats",
        label: "Recuperar estadísticas de cuota",
        className: "Obtener el método api-method"
      }]
    }, {
      type: "categoría",
      label: "Libros de pedidos",
      items: [{
        type: "doc",
        id: "datos/horizon/api-reference/recuperar-un-libro de órdenes",
        label: "Recuperar un libro de pedidos",
        className: "Obtener el método api-method"
      }]
    }, {
      type: "categoría",
      label: "Rutas",
      items: [{
        type: "doc",
        id: "datos/horizon/api-reference/list-strict-receive-payment-paths",
        label: "Listar rutas de pago estrictas",
        className: "Obtener el método api-method"
      }, {
        type: "doc",
        id: "datos/horizon/api-reference/list-strict-send-payment-paths",
        label: "Listar rutas de pago de envío estrictas",
        className: "Obtener el método api-method"
      }]
    }, {
      type: "categoría",
      label: "Agregaciones comerciales",
      items: [{
        type: "doc",
        id: "datos/horizon/api-reference/list-trade-aggregations",
        label: "Lista de Agregaciones de Comercio",
        className: "Obtener el método api-method"
      }]
    }]
  }]
};
export default sidebar.apisidebar;