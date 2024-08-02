import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";
const sidebar: SidebarsConfig = {
  apisidebar: [{
    type: "doc",
    id: "anchor-platform/api-reference/resources/platform-api"
  }, {
    type: "categoría",
    label: "Transacciones",
    items: [{
      type: "doc",
      id: "anchor-platform/api-reference/resources/get-transactions",
      label: "Recuperar una lista de transacciones",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "anchor-plataforma/api-reference/resources/get-transaction",
      label: "Recuperar una transacción",
      className: "Obtener el método api-method"
    }]
  }, {
    type: "categoría",
    label: "SEP-6",
    items: [{
      type: "doc",
      id: "anchor-platform/api-reference/resources/get-transactions",
      label: "Recuperar una lista de transacciones",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "anchor-plataforma/api-reference/resources/get-transaction",
      label: "Recuperar una transacción",
      className: "Obtener el método api-method"
    }]
  }, {
    type: "categoría",
    label: "SEP-24",
    items: [{
      type: "doc",
      id: "anchor-platform/api-reference/resources/get-transactions",
      label: "Recuperar una lista de transacciones",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "anchor-plataforma/api-reference/resources/get-transaction",
      label: "Recuperar una transacción",
      className: "Obtener el método api-method"
    }]
  }, {
    type: "categoría",
    label: "SEP-31",
    items: [{
      type: "doc",
      id: "anchor-platform/api-reference/resources/get-transactions",
      label: "Recuperar una lista de transacciones",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "anchor-plataforma/api-reference/resources/get-transaction",
      label: "Recuperar una transacción",
      className: "Obtener el método api-method"
    }]
  }]
};
export default sidebar.apisidebar;