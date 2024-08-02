import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";
const sidebar: SidebarsConfig = {
  apisidebar: [{
    type: "doc",
    id: "stellar-disbursement-platform/api-reference/resources/stellar-disbursement-platform-api"
  }, {
    type: "categoría",
    label: "Autenticación",
    items: [{
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/log-in",
      label: "Iniciar sesión",
      className: "api-method post"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/refresh-token",
      label: "Actualizar token",
      className: "api-method post"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/autenticate-mfa",
      label: "Proporcionar autenticación de múltiples factores",
      className: "api-method post"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/forgot-password",
      label: "Olvidó la contraseña",
      className: "api-method post"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/reset-password",
      label: "Restablecer Rassword",
      className: "api-method post"
    }]
  }, {
    type: "categoría",
    label: "Desembolsos",
    items: [{
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/list-all-disbursements",
      label: "Listar todos los desembolsos",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/create-disbursement",
      label: "Crear desembolso",
      className: "api-method post"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/retrieve-a-disbursement",
      label: "Recuperar un desembolso",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/list-all-disbursement-receivers",
      label: "Listar todos los receptores de desembolsos",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/upload-disbursement-instructions",
      label: "Subir Instrucciones de Desembolso",
      className: "api-method post"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/download-disbursement-instructions",
      label: "Descargar instrucciones de desembolso",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/update-a-disbursement-status",
      label: "Actualizar un estado de desembolso",
      className: "Parche de api-method"
    }]
  }, {
    type: "categoría",
    label: "Pagos",
    items: [{
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/list-all-payments",
      label: "Listar todos los pagos",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/retrieve-a-payment",
      label: "Recuperar un pago",
      className: "Obtener el método api-method"
    }]
  }, {
    type: "categoría",
    label: "Receptores",
    items: [{
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/list-all-receivers",
      label: "Listar todos los receptores",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/retrieve-a-receiver",
      label: "Recuperar un receptor",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/update-a-receiver",
      label: "Actualizar un receptor",
      className: "Parche de api-method"
    }]
  }, {
    type: "categoría",
    label: "Estadísticas",
    items: [{
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/retrieve-all-statistics",
      label: "Recuperar todas las estadísticas",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/retrieve-disbursement-statistics",
      label: "Recuperar estadísticas de desembolso",
      className: "Obtener el método api-method"
    }]
  }, {
    type: "categoría",
    label: "Registro",
    items: [{
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/start-wallet-registration",
      label: "Iniciar registro de cartera",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/send-one-time-passcode",
      label: "Enviar contraseña de una sola vez",
      className: "api-method post"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/verify-receiver-registration",
      label: "Verificar el registro del receptor",
      className: "api-method post"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/retrieve-stellar-info-file",
      label: "Recuperar archivo de información estelar",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/request-challenge-transaction",
      label: "Solicitar transacción de desafío",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/provide-signed-challenge-transaction",
      label: "Proporcionar transacción de desafío firmado",
      className: "api-method post"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/request-registration-url",
      label: "Solicitar URL de registro",
      className: "api-method post"
    }]
  }, {
    type: "categoría",
    label: "Perfil",
    items: [{
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/get-profile",
      label: "Obtener perfil",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/update-user-profile",
      label: "Actualizar perfil de usuario",
      className: "Parche de api-method"
    }]
  }, {
    type: "categoría",
    label: "Organización",
    items: [{
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/get-organization-info",
      label: "Obtener información de la organización",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/update-organization-profile",
      label: "Actualizar perfil de la organización",
      className: "Parche de api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/get-organization-logo",
      label: "Recuperar logo de la organización",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/get-all-countries",
      label: "Obtener todos los países",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/get-all-assets",
      label: "Obtener todos los activos",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/create-asset",
      label: "Crear Activo",
      className: "api-method post"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/delete-asset",
      label: "Eliminar Activo",
      className: "Borrar método de api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/get-all-wallets",
      label: "Obtener todas las carteras",
      className: "Obtener el método api-method"
    }]
  }, {
    type: "categoría",
    label: "Usuarios",
    items: [{
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/get-all-users",
      label: "Obtener todos los usuarios",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/create-user",
      label: "Crear usuario",
      className: "api-method post"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/update-user-activation-status",
      label: "Actualizar estado de activación del usuario",
      className: "Parche de api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/get-all-roles",
      label: "Obtener todos los roles",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/update-user-role",
      label: "Actualizar rol de usuario",
      className: "Parche de api-method"
    }]
  }, {
    type: "categoría",
    label: "Admin",
    items: [{
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/get-all-tenants",
      label: "Obtener todos los inquilinos",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/create-tenant",
      label: "Crear arrendatario",
      className: "api-method post"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/retrieve-a-tenant",
      label: "Recuperar un inquilino",
      className: "Obtener el método api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/soft-delete-a-un tenant",
      label: "Suprimir un Cliente",
      className: "Borrar método de api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/update-a-tenant",
      label: "Actualizar un inquilino",
      className: "Parche de api-method"
    }, {
      type: "doc",
      id: "stellar-disbursement-platform/api-reference/resources/default-tenant",
      label: "Inquilino por defecto",
      className: "api-method post"
    }]
  }]
};
export default sidebar.apisidebar;