import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";
const sidebar: SidebarsConfig = {
  apisidebar: [{
    type: "doc",
    id: "platforms/stellar-disbursement-platform/api-reference/stellar-disbursement-platform-api"
  }, {
    type: "categoría",
    label: "Administrador (Gestión del inquilino)",
    link: {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/admin"
    },
    items: [{
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/get-all-tenants",
      label: "Obtener todos los inquilinos",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/create-tenant",
      label: "Crear inquilino",
      className: "método-api post"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/retrieve-a-tenant",
      label: "Recuperar un inquilino",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/soft-delete-a-tenant",
      label: "Eliminar suavemente un inquilino",
      className: "método-api delete"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/update-a-tenant",
      label: "Actualizar un inquilino",
      className: "método-api patch"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/default-tenant",
      label: "Inquilino predeterminado",
      className: "método-api post"
    }]
  }, {
    type: "categoría",
    label: "Autenticación",
    link: {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/authentication"
    },
    items: [{
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/log-in",
      label: "Iniciar sesión",
      className: "método-api post"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/refresh-token",
      label: "Actualizar token",
      className: "método-api post"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/authenticate-mfa",
      label: "Proporcionar Autenticación Multifactor",
      className: "método-api post"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/forgot-password",
      label: "Olvidar contraseña",
      className: "método-api post"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/reset-password",
      label: "Restablecer contraseña",
      className: "método-api post"
    }]
  }, {
    type: "categoría",
    label: "Claves API",
    link: {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/api-keys"
    },
    items: [{
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/list-api-keys",
      label: "Listar Claves API",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/create-api-key",
      label: "Crear Clave API",
      className: "método-api post"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/get-api-key",
      label: "Obtener detalles de Clave API",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/update-api-key",
      label: "Actualizar Clave API",
      className: "método-api patch"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/delete-api-key",
      label: "Eliminar Clave API",
      className: "método-api delete"
    }]
  }, {
    type: "categoría",
    label: "Saldos",
    link: {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/balances"
    },
    items: [{
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/get-organization-circle-balances",
      label: "Obtener saldos de la organización (Circle)",
      className: "método-api get"
    }]
  }, {
    type: "categoría",
    label: "Integración Bridge",
    link: {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/bridge-integration"
    },
    items: [{
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/get-bridge-integration",
      label: "Obtener estado de integración con Bridge",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/update-bridge-integration",
      label: "Actualizar estado de integración con Bridge",
      className: "método-api patch"
    }]
  }, {
    type: "categoría",
    label: "Desembolsos",
    link: {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/disbursements"
    },
    items: [{
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/list-all-disbursements",
      label: "Listar todos los desembolsos",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/create-disbursement",
      label: "Crear desembolso",
      className: "método-api post"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/retrieve-a-disbursement",
      label: "Recuperar un desembolso",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/delete-a-disbursement",
      label: "Eliminar un desembolso en borrador",
      className: "método-api delete"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/list-all-disbursement-receivers",
      label: "Listar todos los receptores de desembolso",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/download-disbursement-instructions",
      label: "Descargar instrucciones de desembolso",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/upload-disbursement-instructions",
      label: "Subir instrucciones de desembolso",
      className: "método-api post"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/update-a-disbursement-status",
      label: "Actualizar estado de un desembolso",
      className: "método-api patch"
    }]
  }, {
    type: "categoría",
    label: "Organización",
    link: {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/organization"
    },
    items: [{
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/get-organization-info",
      label: "Obtener información de la organización",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/update-organization-profile",
      label: "Actualizar perfil de la organización",
      className: "método-api patch"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/get-organization-logo",
      label: "Recuperar logo de la organización",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/patch-organization-circle",
      label: "Configuración de cuenta Circle",
      className: "método-api patch"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/get-all-assets",
      label: "Obtener todos los activos",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/create-asset",
      label: "Crear activo",
      className: "método-api post"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/delete-asset",
      label: "Eliminar activo",
      className: "método-api delete"
    }]
  }, {
    type: "categoría",
    label: "Pagos",
    link: {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/payments"
    },
    items: [{
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/list-all-payments",
      label: "Listar todos los pagos",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/create-direct-payment",
      label: "Crear pago directo",
      className: "método-api post"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/retrieve-a-payment",
      label: "Recuperar un pago",
      className: "método-api get"
    }]
  }, {
    type: "categoría",
    label: "Perfil",
    link: {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/profile"
    },
    items: [{
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/get-profile",
      label: "Obtener perfil",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/update-user-profile",
      label: "Actualizar perfil de usuario",
      className: "método-api patch"
    }]
  }, {
    type: "categoría",
    label: "Receptores",
    link: {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/receivers"
    },
    items: [{
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/list-all-receivers",
      label: "Listar todos los receptores",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/create-receiver",
      label: "Crear receptor",
      className: "método-api post"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/retrieve-a-receiver",
      label: "Recuperar un receptor",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/update-receiver",
      label: "Actualizar un receptor",
      className: "método-api patch"
    }]
  }, {
    type: "categoría",
    label: "Registro",
    link: {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/registration"
    },
    items: [{
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/start-wallet-registration",
      label: "Iniciar registro de cartera",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/send-one-time-passcode",
      label: "Enviar código de acceso único",
      className: "método-api post"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/verify-receiver-registration",
      label: "Verificar registro del receptor",
      className: "método-api post"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/retrieve-stellar-info-file",
      label: "Recuperar archivo de información Stellar",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/request-challenge-transaction",
      label: "Solicitar transacción de desafío",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/provide-signed-challenge-transaction",
      label: "Proporcionar transacción de desafío firmada",
      className: "método-api post"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/request-registration-url",
      label: "Solicitar URL de registro",
      className: "método-api post"
    }]
  }, {
    type: "categoría",
    label: "Estadísticas",
    link: {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/statistics"
    },
    items: [{
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/retrieve-all-statistics",
      label: "Recuperar todas las estadísticas",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/retrieve-disbursement-statistics",
      label: "Recuperar estadísticas de desembolsos",
      className: "método-api get"
    }]
  }, {
    type: "categoría",
    label: "Usuarios",
    link: {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/users"
    },
    items: [{
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/get-all-users",
      label: "Obtener todos los usuarios",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/create-user",
      label: "Crear usuario",
      className: "método-api post"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/update-user-activation-status",
      label: "Actualizar estado de activación del usuario",
      className: "método-api patch"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/get-all-roles",
      label: "Obtener todos los roles",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/update-user-role",
      label: "Actualizar rol de usuario",
      className: "método-api patch"
    }]
  }, {
    type: "categoría",
    label: "Exportaciones",
    items: [{
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/export-disbursements",
      label: "Exportar desembolsos",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/export-payments-csv",
      label: "Exportar pagos",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/export-receivers-csv",
      label: "Exportar receptores",
      className: "método-api get"
    }]
  }, {
    type: "categoría",
    label: "Carteras",
    items: [{
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/get-all-wallets",
      label: "Obtener todas las carteras",
      className: "método-api get"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/create-wallet",
      label: "Crear cartera",
      className: "método-api post"
    }, {
      type: "doc",
      id: "platforms/stellar-disbursement-platform/api-reference/update-wallet",
      label: "Actualizar cartera",
      className: "método-api patch"
    }]
  }]
};
export default sidebar.apisidebar;