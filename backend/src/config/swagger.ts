import swaggerJsdoc from "swagger-jsdoc";
import { config } from "./env";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sistema de Gestión de Calidad ISO 9001 - API",
      version: "1.0.0",
      description:
        "API REST para el Sistema de Gestión de Calidad basado en ISO 9001. " +
        "Esta API proporciona endpoints para gestión de usuarios, documentos, procesos, auditorías, riesgos y más.",
      contact: {
        name: "Equipo de Desarrollo",
        email: "soporte@sgc.com",
      },
      license: {
        name: "ISC",
        url: "https://opensource.org/licenses/ISC",
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: "Servidor de desarrollo",
      },
      {
        url: "https://api.sgc.com",
        description: "Servidor de producción",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Ingrese su token JWT en el formato: Bearer {token}",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Mensaje de error",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
              },
              description: "Detalles de errores de validación",
            },
          },
        },
        Usuario: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID único del usuario",
            },
            nombre: {
              type: "string",
              description: "Nombre completo del usuario",
            },
            email: {
              type: "string",
              format: "email",
              description: "Correo electrónico del usuario",
            },
            activo: {
              type: "boolean",
              description: "Estado del usuario",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Fecha de creación",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Fecha de última actualización",
            },
          },
        },
        Area: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID único del área",
            },
            nombre: {
              type: "string",
              description: "Nombre del área",
            },
            descripcion: {
              type: "string",
              description: "Descripción del área",
            },
            activa: {
              type: "boolean",
              description: "Estado del área",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Rol: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID único del rol",
            },
            nombre: {
              type: "string",
              description: "Nombre del rol",
            },
            descripcion: {
              type: "string",
              description: "Descripción del rol",
            },
            activo: {
              type: "boolean",
              description: "Estado del rol",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Documento: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID único del documento",
            },
            codigo: {
              type: "string",
              description: "Código del documento",
            },
            nombre: {
              type: "string",
              description: "Nombre del documento",
            },
            tipo: {
              type: "string",
              enum: ["manual", "procedimiento", "instructivo", "formato", "registro"],
              description: "Tipo de documento",
            },
            version: {
              type: "string",
              description: "Versión actual del documento",
            },
            estado: {
              type: "string",
              enum: ["borrador", "revision", "aprobado", "obsoleto"],
              description: "Estado del documento",
            },
            archivoUrl: {
              type: "string",
              description: "URL del archivo",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Notificacion: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID único de la notificación",
            },
            usuarioId: {
              type: "integer",
              description: "ID del usuario destinatario",
            },
            titulo: {
              type: "string",
              description: "Título de la notificación",
            },
            mensaje: {
              type: "string",
              description: "Contenido de la notificación",
            },
            tipo: {
              type: "string",
              enum: ["info", "advertencia", "error", "exito"],
              description: "Tipo de notificación",
            },
            leida: {
              type: "boolean",
              description: "Estado de lectura",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Permiso: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID único del permiso",
            },
            nombre: {
              type: "string",
              description: "Nombre del permiso",
              example: "usuarios.crear",
            },
            descripcion: {
              type: "string",
              description: "Descripción del permiso",
            },
            modulo: {
              type: "string",
              description: "Módulo al que pertenece el permiso",
              example: "usuarios",
            },
            activo: {
              type: "boolean",
              description: "Estado del permiso",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        RolPermiso: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID único de la asociación",
            },
            rolId: {
              type: "integer",
              description: "ID del rol",
            },
            permisoId: {
              type: "integer",
              description: "ID del permiso",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Configuracion: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID único de la configuración",
            },
            clave: {
              type: "string",
              description: "Clave única de configuración",
              example: "empresa.nombre",
            },
            valor: {
              type: "string",
              description: "Valor de la configuración",
            },
            descripcion: {
              type: "string",
              description: "Descripción de la configuración",
            },
            tipo: {
              type: "string",
              enum: ["texto", "numero", "boolean", "json"],
              description: "Tipo de dato de la configuración",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Autenticación",
        description: "Endpoints para autenticación y gestión de tokens",
      },
      {
        name: "Usuarios",
        description: "Gestión de usuarios del sistema",
      },
      {
        name: "Áreas",
        description: "Gestión de áreas organizacionales",
      },
      {
        name: "Roles",
        description: "Gestión de roles y permisos",
      },
      {
        name: "Documentos",
        description: "Gestión de documentos del sistema de calidad",
      },
      {
        name: "Notificaciones",
        description: "Gestión de notificaciones del sistema",
      },
      {
        name: "Permisos",
        description: "Gestión de permisos del sistema",
      },
      {
        name: "Roles-Permisos",
        description: "Gestión de la asociación entre roles y permisos",
      },
      {
        name: "Configuración",
        description: "Configuración del sistema",
      },
      {
        name: "Auditorías",
        description: "Gestión de auditorías internas y externas (ISO 9001 Cláusula 9.2)",
      },
      {
        name: "Auditoría de Sistema",
        description: "Tracking y registro de acciones del sistema (logs de auditoría)",
      },
      {
        name: "Hallazgos de Auditoría",
        description: "Gestión de hallazgos detectados en auditorías",
      },
      {
        name: "Riesgos",
        description: "Gestión de riesgos y su identificación",
      },
      {
        name: "Controles de Riesgo",
        description: "Gestión de controles para mitigar riesgos",
      },
      {
        name: "Acciones Correctivas",
        description: "Gestión de acciones correctivas y preventivas",
      },
      {
        name: "No Conformidades",
        description: "Gestión de no conformidades detectadas",
      },
      {
        name: "Procesos",
        description: "Gestión de procesos del sistema de calidad",
      },
      {
        name: "Acciones de Proceso",
        description: "Gestión de acciones dentro de procesos",
      },
      {
        name: "Etapas de Proceso",
        description: "Gestión de etapas de procesos",
      },
      {
        name: "Instancias de Proceso",
        description: "Gestión de instancias de ejecución de procesos",
      },
      {
        name: "Participantes de Proceso",
        description: "Gestión de participantes en procesos",
      },
      {
        name: "Documentos de Proceso",
        description: "Gestión de documentos asociados a procesos",
      },
      {
        name: "Objetivos de Calidad",
        description: "Gestión de objetivos de calidad",
      },
      {
        name: "Seguimiento de Objetivos",
        description: "Gestión del seguimiento de objetivos de calidad",
      },
      {
        name: "Indicadores",
        description: "Gestión de indicadores de desempeño",
      },
      {
        name: "Capacitaciones",
        description: "Gestión de capacitaciones del personal",
      },
      {
        name: "Asistencias a Capacitación",
        description: "Gestión de asistencias a capacitaciones",
      },
      {
        name: "Campos de Formulario",
        description: "Gestión de campos personalizados de formularios",
      },
    ],
  },
  apis: [
    "./src/routes/*.ts", // Rutas
    "./src/controllers/*.ts", // Controladores
    "./src/models/*.ts", // Modelos
  ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
