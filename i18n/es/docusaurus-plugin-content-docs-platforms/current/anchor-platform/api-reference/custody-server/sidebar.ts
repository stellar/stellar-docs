import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";
const sidebar: SidebarsConfig = {
  apisidebar: [{
    type: "doc",
    id: "anchor-plataforma/api-reference/custody-server/custody-server-api"
  }, {
    type: "categoría",
    label: "Transacciones de Custodia",
    items: [{
      type: "doc",
      id: "anchor-plataforma/api-reference/custody-server/create-custody-transaction",
      label: "Crear transacción de Custodia",
      className: "api-method post"
    }]
  }, {
    type: "categoría",
    label: "Pagos",
    items: [{
      type: "doc",
      id: "anchor-plataforma/api-reference/custody-server/enviar-pago",
      label: "Enviar pago",
      className: "api-method post"
    }]
  }, {
    type: "categoría",
    label: "Reembolsos",
    items: [{
      type: "doc",
      id: "anchor-platform/api-reference/custody-server/send-refund",
      label: "Enviar reembolso",
      className: "api-method post"
    }]
  }, {
    type: "categoría",
    label: "Dirección única",
    items: [{
      type: "doc",
      id: "anchor-plataforma/api-reference/custody-server/generate-unique-address",
      label: "Generar dirección única",
      className: "api-method post"
    }]
  }, {
    type: "categoría",
    label: "SEP-6",
    items: [{
      type: "doc",
      id: "anchor-plataforma/api-reference/custody-server/create-custody-transaction",
      label: "Crear transacción de Custodia",
      className: "api-method post"
    }, {
      type: "doc",
      id: "anchor-plataforma/api-reference/custody-server/enviar-pago",
      label: "Enviar pago",
      className: "api-method post"
    }, {
      type: "doc",
      id: "anchor-platform/api-reference/custody-server/send-refund",
      label: "Enviar reembolso",
      className: "api-method post"
    }, {
      type: "doc",
      id: "anchor-plataforma/api-reference/custody-server/generate-unique-address",
      label: "Generar dirección única",
      className: "api-method post"
    }]
  }, {
    type: "categoría",
    label: "SEP-24",
    items: [{
      type: "doc",
      id: "anchor-plataforma/api-reference/custody-server/create-custody-transaction",
      label: "Crear transacción de Custodia",
      className: "api-method post"
    }, {
      type: "doc",
      id: "anchor-plataforma/api-reference/custody-server/enviar-pago",
      label: "Enviar pago",
      className: "api-method post"
    }, {
      type: "doc",
      id: "anchor-platform/api-reference/custody-server/send-refund",
      label: "Enviar reembolso",
      className: "api-method post"
    }, {
      type: "doc",
      id: "anchor-plataforma/api-reference/custody-server/generate-unique-address",
      label: "Generar dirección única",
      className: "api-method post"
    }]
  }, {
    type: "categoría",
    label: "SEP-31",
    items: [{
      type: "doc",
      id: "anchor-plataforma/api-reference/custody-server/create-custody-transaction",
      label: "Crear transacción de Custodia",
      className: "api-method post"
    }, {
      type: "doc",
      id: "anchor-plataforma/api-reference/custody-server/enviar-pago",
      label: "Enviar pago",
      className: "api-method post"
    }, {
      type: "doc",
      id: "anchor-platform/api-reference/custody-server/send-refund",
      label: "Enviar reembolso",
      className: "api-method post"
    }, {
      type: "doc",
      id: "anchor-plataforma/api-reference/custody-server/generate-unique-address",
      label: "Generar dirección única",
      className: "api-method post"
    }]
  }]
};
export default sidebar.apisidebar;