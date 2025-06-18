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
    label: "Saldos",
    link: {
      type: "doc",
      id: "api-reference/balances"
    },
    items: [{
      type: "doc",
      id: "api-reference/get-organization-circle-balances",
      label: "Obtener saldos de organización (Circle)",
      className: "api-method get"
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
      id: "Referencia de la API/eliminar un desembolso",
      label: "Elimina un Desembolso Borrador",
      className: "método api eliminar"
    }, {
      type: "doc",
      id: "Referencia de la API/listar todos los receptores de desembolso",
      label: "Listar Todos los Receptores de Desembolso",
      className: "api-method get"
    }, {
      type: "doc",
      id: "Referencia de la API/descargar instrucciones de desembolso",
      label: "Descargar Instrucciones de Desembolso",
      className: "método api obtener"
    }, {
      type: "doc",
      id: "Referencia de la API/subir instrucciones de desembolso",
      label: "Subir Instrucciones de Desembolso",
      className: "método api publicar"
    }, {
      type: "doc",
      id: "Referencia de la API/actualizar un estado de desembolso",
      label: "Actualizar un Estatus de Desembolso",
      className: "método api parchear"
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
      label: "Obtener información de la organización",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/update-organization-profile",
      label: "Actualizar perfil de organización",
      className: "api-method patch"
    }, {
      type: "doc",
      id: "api-reference/get-organization-logo",
      label: "Recuperar el logo de la organización",
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
      label: "Iniciar el registro de billetera",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/send-one-time-passcode",
      label: "Enviar código de un solo uso",
      className: "api-method post"
    }, {
      type: "doc",
      id: "api-reference/verify-receiver-registration",
      label: "Verificar registro del receptor",
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
    type: "category",
    label: "Estadísticas",
    link: {
      type: "doc",
      id: "api-reference/statistics"
    },
    items: [{
      type: "doc",
      id: "api-reference/retrieve-all-statistics",
      label: "Recuperar todas las estadísticas",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/retrieve-disbursement-statistics",
      label: "Recuperar estadísticas de desembolso",
      className: "api-method get"
    }]
  }, {
    type: "category",
    label: "Usuarios",
    link: {
      type: "doc",
      id: "api-reference/users"
    },
    items: [{
      type: "doc",
      id: "api-reference/get-all-users",
      label: "Obtener todos los usuarios",
      className: "api-method get"
    }, {
      type: "doc",
      id: "api-reference/create-user",
      label: "Crear usuario",
      className: "api-method post"
    }, {
      type: "doc",
      id: "api-reference/update-user-activation-status",
      label: "Actualizar estado de activación de usuario",
      className: "api-método patch"
    }, {
      type: "doc",
      id: "api-referencia/get-all-roles",
      label: "Obtener Todos los Roles",
      className: "api-método get"
    }, {
      type: "doc",
      id: "api-referencia/update-user-role",
      label: "Actualizar el Rol del Usuario",
      className: "api-método patch"
    }]
  }, {
    type: "categoría",
    label: "Exportaciones",
    items: [{
      type: "doc",
      id: "Referencia de la API/exportar desembolsos",
      label: "Exportar Desembolsos",
      className: "api-método get"
    }, {
      type: "doc",
      id: "Referencia de la API/exportar pagos CSV",
      label: "Exportar Pagos",
      className: "método api obtener"
    }, {
      type: "doc",
      id: "Referencia de la API/exportar receptores CSV",
      label: "Exportar Receptores",
      className: "método api obtener"
    }]
  }, {
    type: "categoría",
    label: "Billeteras",
    items: [{
      type: "doc",
      id: "Referencia de la API/obtener todas las billeteras",
      label: "Obtener Todas las Billeteras",
      className: "método api obtener"
    }, {
      type: "doc",
      id: "Referencia de la API/actualizar billetera",
      label: "Actualizar Billetera",
      className: "método api parchear"
    }]
  }]
};
export default sidebar.apisidebar;