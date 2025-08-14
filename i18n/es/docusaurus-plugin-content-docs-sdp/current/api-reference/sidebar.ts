import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";
const sidebar: SidebarsConfig = {
  apisidebar: [{
    type: "doc",
    id: "api-reference/stellar-disbursement-platform-api"
  }, {
    type: "category",
    label: "Administración (Gestión de inquilinos)",
    link: {
      type: "doc",
      id: "api-reference/admin"
    },
    items: [{
      type: "doc",
      id: "api-reference/get-all-tenants",
      label: "Obtener todos los inquilinos",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/create-tenant",
      label: "Crear inquilino",
      className: "api-method post"
    }, {
      type: "doc",
      id: "api-reference/retrieve-a-tenant",
      label: "Recuperar un inquilino",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/soft-delete-a-tenant",
      label: "Eliminar suavemente un inquilino",
      className: "api-method delete"
    }, {
      type: "doc",
      id: "api-reference/update-a-tenant",
      label: "Actualizar un inquilino",
      className: "api-method patch"
    }, {
      type: "doc",
      id: "api-reference/default-tenant",
      label: "Inquilino predeterminado",
      className: "api-method post"
    }]
  }, {
    type: "category",
    label: "Autenticación",
    link: {
      type: "doc",
      id: "api-reference/authentication"
    },
    items: [{
      type: "doc",
      id: "api-reference/log-in",
      label: "Iniciar sesión",
      className: "api-method post"
    }, {
      type: "doc",
      id: "api-reference/refresh-token",
      label: "Actualizar token",
      className: "api-method post"
    }, {
      type: "doc",
      id: "api-reference/authenticate-mfa",
      label: "Proporcionar autenticación multifactor",
      className: "api-method post"
    }, {
      type: "doc",
      id: "api-reference/forgot-password",
      label: "Olvidé la contraseña",
      className: "api-method post"
    }, {
      type: "doc",
      id: "api-reference/reset-password",
      label: "Restablecer la contraseña",
      className: "api-method post"
    }]
  }, {
    type: "category",
    label: "Claves API",
    link: {
      type: "doc",
      id: "api-reference/api-keys"
    },
    items: [{
      type: "doc",
      id: "api-reference/list-api-keys",
      label: "Listar claves API",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/create-api-key",
      label: "Crear clave API",
      className: "api-method post"
    }, {
      type: "doc",
      id: "api-reference/get-api-key",
      label: "Obtener detalles de la clave API",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/update-api-key",
      label: "Actualizar clave API",
      className: "api-method patch"
    }, {
      type: "doc",
      id: "api-reference/delete-api-key",
      label: "Eliminar clave API",
      className: "api-method delete"
    }]
  }, {
    type: "category",
    label: "Saldos",
    link: {
      type: "doc",
      id: "api-reference/balances"
    },
    items: [{
      type: "doc",
      id: "api-reference/get-organization-circle-balances",
      label: "Obtener saldos de la organización (Circle)",
      className: "api-method get"
    }]
  }, {
    type: "category",
    label: "Integración de Bridge",
    link: {
      type: "doc",
      id: "api-reference/bridge-integration"
    },
    items: [{
      type: "doc",
      id: "api-reference/get-bridge-integration",
      label: "Obtener estado de integración de Bridge",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/update-bridge-integration",
      label: "Actualizar estado de integración de Bridge",
      className: "api-method patch"
    }]
  }, {
    type: "category",
    label: "Desembolsos",
    link: {
      type: "doc",
      id: "api-reference/disbursements"
    },
    items: [{
      type: "doc",
      id: "api-reference/list-all-disbursements",
      label: "Listar todos los desembolsos",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/create-disbursement",
      label: "Crear desembolso",
      className: "api-method post"
    }, {
      type: "doc",
      id: "api-reference/retrieve-a-disbursement",
      label: "Recuperar un desembolso",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/delete-a-disbursement",
      label: "Eliminar un desembolso borrador",
      className: "api-method delete"
    }, {
      type: "doc",
      id: "api-reference/list-all-disbursement-receivers",
      label: "Listar todos los receptores de desembolsos",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/download-disbursement-instructions",
      label: "Descargar instrucciones de desembolso",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/upload-disbursement-instructions",
      label: "Subir instrucciones de desembolso",
      className: "api-method post"
    }, {
      type: "doc",
      id: "api-reference/update-a-disbursement-status",
      label: "Actualizar estado de un desembolso",
      className: "api-method patch"
    }]
  }, {
    type: "category",
    label: "Organización",
    link: {
      type: "doc",
      id: "api-reference/organization"
    },
    items: [{
      type: "doc",
      id: "api-reference/get-organization-info",
      label: "Obtener información de organización",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/update-organization-profile",
      label: "Actualizar perfil de organización",
      className: "api-method patch"
    }, {
      type: "doc",
      id: "api-reference/get-organization-logo",
      label: "Recuperar logo de organización",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/patch-organization-circle",
      label: "Configuración de cuenta Circle",
      className: "api-method patch"
    }, {
      type: "doc",
      id: "api-reference/get-all-assets",
      label: "Obtener todos los activos",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/create-asset",
      label: "Crear activo",
      className: "api-method post"
    }, {
      type: "doc",
      id: "api-reference/delete-asset",
      label: "Eliminar activo",
      className: "api-method delete"
    }, {
      type: "doc",
      id: "api-reference/get-all-wallets",
      label: "Obtener todas las billeteras",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/create-wallet",
      label: "Crear billetera",
      className: "api-method post"
    }, {
      type: "doc",
      id: "api-reference/update-wallet",
      label: "Actualizar billetera",
      className: "api-method patch"
    }]
  }, {
    type: "category",
    label: "Pagos",
    link: {
      type: "doc",
      id: "api-reference/payments"
    },
    items: [{
      type: "doc",
      id: "api-reference/list-all-payments",
      label: "Listar todos los pagos",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/create-direct-payment",
      label: "Crear pago directo",
      className: "api-method post"
    }, {
      type: "doc",
      id: "api-reference/retrieve-a-payment",
      label: "Recuperar un pago",
      className: "api-method get"
    }]
  }, {
    type: "category",
    label: "Perfil",
    link: {
      type: "doc",
      id: "api-reference/profile"
    },
    items: [{
      type: "doc",
      id: "api-reference/get-profile",
      label: "Obtener perfil",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/update-user-profile",
      label: "Actualizar perfil de usuario",
      className: "api-method patch"
    }]
  }, {
    type: "category",
    label: "Receptores",
    link: {
      type: "doc",
      id: "api-reference/receivers"
    },
    items: [{
      type: "doc",
      id: "api-reference/list-all-receivers",
      label: "Listar todos los receptores",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/create-receiver",
      label: "Crear receptor",
      className: "api-method post"
    }, {
      type: "doc",
      id: "api-reference/retrieve-a-receiver",
      label: "Recuperar un receptor",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/update-receiver",
      label: "Actualizar un receptor",
      className: "api-method patch"
    }]
  }, {
    type: "category",
    label: "Registro",
    link: {
      type: "doc",
      id: "api-reference/registration"
    },
    items: [{
      type: "doc",
      id: "api-reference/start-wallet-registration",
      label: "Iniciar registro de billetera",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/send-one-time-passcode",
      label: "Enviar código de acceso único",
      className: "api-method post"
    }, {
      type: "doc",
      id: "api-reference/verify-receiver-registration",
      label: "Verificar registro de receptor",
      className: "api-method post"
    }, {
      type: "doc",
      id: "api-reference/retrieve-stellar-info-file",
      label: "Recuperar archivo de información Stellar",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/request-challenge-transaction",
      label: "Solicitar transacción de desafío",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/provide-signed-challenge-transaction",
      label: "Proporcionar transacción de desafío firmada",
      className: "api-method post"
    }, {
      type: "doc",
      id: "api-reference/request-registration-url",
      label: "Solicitar URL de registro",
      className: "api-method post"
    }]
  }, {
    type: "categoría",
    label: "Estadísticas",
    link: {
      type: "doc",
      id: "api-reference/statistics"
    },
    items: [{
      type: "doc",
      id: "api-reference/retrieve-all-statistics",
      label: "Recuperar todas las estadísticas",
      className: "api-método get"
    }, {
      type: "doc",
      id: "api-reference/retrieve-disbursement-statistics",
      label: "Recuperar estadísticas de desembolso",
      className: "api-method get"
    }]
  }, {
    type: "categoría",
    label: "Usuarios",
    link: {
      type: "doc",
      id: "api-reference/users"
    },
    items: [{
      type: "doc",
      id: "api-reference/get-all-users",
      label: "Obtener todos los usuarios",
      className: "método api obtener"
    }, {
      type: "doc",
      id: "api-reference/create-user",
      label: "Crear usuario",
      className: "api-method post"
    }, {
      type: "doc",
      id: "api-reference/update-user-activation-status",
      label: "Actualizar estado de activación de usuario",
      className: "api-method patch"
    }, {
      type: "doc",
      id: "api-reference/get-all-roles",
      label: "Obtener todos los roles",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/update-user-role",
      label: "Actualizar rol de usuario",
      className: "api-method patch"
    }]
  }, {
    type: "category",
    label: "Exportaciones",
    items: [{
      type: "doc",
      id: "api-reference/export-disbursements",
      label: "Exportar desembolsos",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/export-payments-csv",
      label: "Exportar pagos",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/export-receivers-csv",
      label: "Exportar receptores",
      className: "api-method get"
    }]
  }, {
    type: "category",
    label: "Billeteras",
    items: [{
      type: "doc",
      id: "api-reference/get-all-wallets",
      label: "Obtener todas las billeteras",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/create-wallet",
      label: "Crear billetera",
      className: "api-method post"
    }, {
      type: "doc",
      id: "api-reference/update-wallet",
      label: "Actualizar billetera",
      className: "api-method patch"
    }]
  }]
};
export default sidebar.apisidebar;