"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create areas table
    await queryInterface.createTable("areas", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      codigo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create usuarios table
    await queryInterface.createTable("usuarios", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      documento: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      segundo_nombre: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      primer_apellido: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      segundo_apellido: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      correo_electronico: {
        type: Sequelize.STRING(254),
        allowNull: false,
      },
      nombre_usuario: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      contrasena_hash: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      area_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "areas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create roles table
    await queryInterface.createTable("roles", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      nombre: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      clave: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create permisos table
    await queryInterface.createTable("permisos", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      nombre: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      codigo: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create usuario_roles junction table
    await queryInterface.createTable("usuario_roles", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      usuario_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      rol_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create rol_permisos junction table
    await queryInterface.createTable("rol_permisos", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      rol_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      permiso_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "permisos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create procesos table
    await queryInterface.createTable("procesos", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      codigo: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      nombre: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      area_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "areas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      objetivo: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      alcance: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      etapa_phva: {
        type: Sequelize.STRING(50),
        allowNull: true,
        validate: {
          isIn: [["planear", "hacer", "verificar", "actuar"]],
        },
      },
      restringido: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      creado_por: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      tipo_proceso: {
        type: Sequelize.STRING(50),
        allowNull: true,
        validate: {
          isIn: [["estrategico", "operativo", "apoyo"]],
        },
      },
      responsable_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      estado: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "activo",
        validate: {
          isIn: [["activo", "inactivo", "revision", "obsoleto"]],
        },
      },
      version: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      fecha_aprobacion: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      proxima_revision: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create documentos table
    await queryInterface.createTable("documentos", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      codigo: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      nombre: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tipo_documento: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      ruta_archivo: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      version_actual: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "1.0",
      },
      estado: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "borrador",
      },
      fecha_aprobacion: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      fecha_vigencia: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      creado_por: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      aprobado_por: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create version_documentos table
    await queryInterface.createTable("version_documentos", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      documento_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "documentos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      version: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      descripcion_cambios: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ruta_archivo: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      creado_por: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create documento_procesos junction table
    await queryInterface.createTable("documento_procesos", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      documento_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "documentos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      proceso_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "procesos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      tipo_relacion: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "asociado",
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create etapa_procesos table
    await queryInterface.createTable("etapa_procesos", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      proceso_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "procesos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      nombre: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      orden: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      responsable_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      tiempo_estimado: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      activa: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create instancia_procesos table
    await queryInterface.createTable("instancia_procesos", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      proceso_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "procesos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      codigo_instancia: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      estado: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "iniciado",
      },
      fecha_inicio: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      fecha_fin: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      iniciado_por: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create participante_procesos table
    await queryInterface.createTable("participante_procesos", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      instancia_proceso_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "instancia_procesos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      usuario_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      rol_participacion: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      fecha_asignacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create indicadores table
    await queryInterface.createTable("indicadores", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      proceso_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "procesos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      codigo: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      nombre: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      formula: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      unidad_medida: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      meta: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      frecuencia_medicion: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "mensual",
      },
      responsable_medicion_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create no_conformidades table
    await queryInterface.createTable("no_conformidades", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      codigo: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      proceso_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "procesos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      tipo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          isIn: [["mayor", "menor", "observacion"]],
        },
      },
      fuente: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      detectado_por: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      fecha_deteccion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      estado: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "abierta",
      },
      analisis_causa: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      plan_accion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      fecha_cierre: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      responsable_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    /// Create acciones_correctivas table
    await queryInterface.createTable("acciones_correctivas", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      no_conformidad_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "no_conformidades",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      codigo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      tipo: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      analisis_causa_raiz: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      plan_accion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      responsable_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      fecha_compromiso: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      fecha_implementacion: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      estado: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      eficacia_verificada: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      verificado_por: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      fecha_verificacion: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      observacion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create auditorias table
    await queryInterface.createTable("auditorias", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      codigo: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      nombre: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      tipo_auditoria: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          isIn: [["interna", "externa", "certificacion"]],
        },
      },
      alcance: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      objetivo: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      fecha_planificada: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      fecha_inicio: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      fecha_fin: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      estado: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "planificada",
      },
      equipo_auditor: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      auditor_lider_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      creado_por: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      informe_final: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create hallazgo_auditorias table
    await queryInterface.createTable("hallazgo_auditorias", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      auditoria_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "auditorias",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      codigo: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      tipo_hallazgo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          isIn: [
            [
              "conformidad",
              "no_conformidad_mayor",
              "no_conformidad_menor",
              "observacion",
              "oportunidad_mejora",
            ],
          ],
        },
      },
      proceso_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "procesos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      clausula_norma: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      evidencia: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      responsable_respuesta_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      fecha_respuesta: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      estado: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "abierto",
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create riesgos table
    await queryInterface.createTable("riesgos", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      proceso_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "procesos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      codigo: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      categoria: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      tipo_riesgo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          isIn: [
            [
              "operacional",
              "financiero",
              "estrategico",
              "cumplimiento",
              "reputacional",
            ],
          ],
        },
      },
      probabilidad: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5,
        },
      },
      impacto: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5,
        },
      },
      nivel_riesgo: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      causas: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      consecuencias: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      responsable_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      estado: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "activo",
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create control_riesgos table
    await queryInterface.createTable("control_riesgos", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      riesgo_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "riesgos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      tipo_control: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          isIn: [["preventivo", "detectivo", "correctivo"]],
        },
      },
      frecuencia: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      responsable_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      efectividad: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create objetivos_calidad table
    await queryInterface.createTable("objetivos_calidad", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      codigo: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      area_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "areas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      responsable_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      fecha_inicio: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      fecha_fin: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      estado: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "planificado",
      },
      progreso: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create seguimiento_objetivos table
    await queryInterface.createTable("seguimiento_objetivos", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      objetivo_calidad_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "objetivos_calidad",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      fecha_seguimiento: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      valor_actual: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      responsable_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create capacitaciones table
    await queryInterface.createTable("capacitaciones", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      codigo: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      nombre: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tipo_capacitacion: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      modalidad: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          isIn: [["presencial", "virtual", "mixta"]],
        },
      },
      duracion_horas: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      instructor: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      fecha_programada: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      fecha_realizacion: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      lugar: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      estado: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "programada",
      },
      objetivo: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      contenido: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      responsable_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create asistencia_capacitaciones table
    await queryInterface.createTable("asistencia_capacitaciones", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      capacitacion_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "capacitaciones",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      usuario_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      asistio: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      calificacion: {
        type: Sequelize.DECIMAL(3, 1),
        allowNull: true,
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      certificado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      fecha_registro: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create accion_procesos table
    await queryInterface.createTable("accion_procesos", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      proceso_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "procesos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      codigo: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      nombre: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tipo_accion: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          isIn: [["correctiva", "preventiva", "mejora"]],
        },
      },
      origen: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      responsable_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      fecha_planificada: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      fecha_implementacion: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      fecha_verificacion: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      estado: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "planificada",
      },
      efectividad: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create notificaciones table
    await queryInterface.createTable("notificaciones", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      usuario_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      titulo: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      mensaje: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      tipo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          isIn: [["info", "warning", "error", "success"]],
        },
      },
      leida: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      fecha_lectura: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      referencia_tipo: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      referencia_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create configuraciones table
    await queryInterface.createTable("configuraciones", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      clave: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      valor: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tipo_dato: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "string",
        validate: {
          isIn: [["string", "number", "boolean", "json"]],
        },
      },
      categoria: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      activa: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create campo_formularios table
    await queryInterface.createTable("campo_formularios", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      proceso_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "procesos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      nombre: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      etiqueta: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      tipo_campo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          isIn: [
            [
              "text",
              "textarea",
              "number",
              "date",
              "select",
              "checkbox",
              "radio",
              "file",
            ],
          ],
        },
      },
      requerido: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      opciones: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      orden: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      validaciones: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create respuesta_formularios table
    await queryInterface.createTable("respuesta_formularios", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      campo_formulario_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "campo_formularios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      instancia_proceso_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "instancia_procesos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      valor: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      archivo_adjunto: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      usuario_respuesta_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create tickets table
    await queryInterface.createTable("tickets", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      codigo: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      titulo: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      categoria: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      prioridad: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "media",
        validate: {
          isIn: [["baja", "media", "alta", "critica"]],
        },
      },
      estado: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "abierto",
        validate: {
          isIn: [["abierto", "en_proceso", "resuelto", "cerrado", "cancelado"]],
        },
      },
      solicitante_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      asignado_a: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      fecha_limite: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      fecha_resolucion: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      solucion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tiempo_resolucion: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      satisfaccion_cliente: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5,
        },
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add unique constraints
    await queryInterface.addConstraint("usuario_roles", {
      fields: ["usuario_id", "rol_id"],
      type: "unique",
      name: "usuario_roles_unique_constraint",
    });

    await queryInterface.addConstraint("rol_permisos", {
      fields: ["rol_id", "permiso_id"],
      type: "unique",
      name: "rol_permisos_unique_constraint",
    });

    await queryInterface.addConstraint("documento_procesos", {
      fields: ["documento_id", "proceso_id"],
      type: "unique",
      name: "documento_procesos_unique_constraint",
    });

    await queryInterface.addConstraint("participante_procesos", {
      fields: ["instancia_proceso_id", "usuario_id"],
      type: "unique",
      name: "participante_procesos_unique_constraint",
    });

    await queryInterface.addConstraint("asistencia_capacitaciones", {
      fields: ["capacitacion_id", "usuario_id"],
      type: "unique",
      name: "asistencia_capacitaciones_unique_constraint",
    });

    // Add indexes for better performance
    await queryInterface.addIndex("usuarios", ["documento"]);
    await queryInterface.addIndex("usuarios", ["nombre_usuario"]);
    await queryInterface.addIndex("usuarios", ["correo_electronico"]);
    await queryInterface.addIndex("usuarios", ["area_id"]);
    await queryInterface.addIndex("procesos", ["codigo"]);
    await queryInterface.addIndex("procesos", ["area_id"]);
    await queryInterface.addIndex("procesos", ["estado"]);
    await queryInterface.addIndex("documentos", ["codigo"]);
    await queryInterface.addIndex("documentos", ["tipo_documento"]);
    await queryInterface.addIndex("documentos", ["estado"]);
    await queryInterface.addIndex("no_conformidades", ["codigo"]);
    await queryInterface.addIndex("no_conformidades", ["proceso_id"]);
    await queryInterface.addIndex("no_conformidades", ["estado"]);
    await queryInterface.addIndex("auditorias", ["codigo"]);
    await queryInterface.addIndex("auditorias", ["estado"]);
    await queryInterface.addIndex("riesgos", ["codigo"]);
    await queryInterface.addIndex("riesgos", ["proceso_id"]);
    await queryInterface.addIndex("indicadores", ["codigo"]);
    await queryInterface.addIndex("indicadores", ["proceso_id"]);
    await queryInterface.addIndex("objetivos_calidad", ["codigo"]);
    await queryInterface.addIndex("capacitaciones", ["codigo"]);
    await queryInterface.addIndex("capacitaciones", ["estado"]);
    await queryInterface.addIndex("tickets", ["codigo"]);
    await queryInterface.addIndex("tickets", ["estado"]);
    await queryInterface.addIndex("notificaciones", ["usuario_id"]);
    await queryInterface.addIndex("notificaciones", ["leida"]);
  },

  async down(queryInterface, Sequelize) {
    // Drop tables in reverse order to handle foreign key constraints
    const tables = [
      "respuesta_formularios",
      "campo_formularios",
      "configuraciones",
      "notificaciones",
      "accion_procesos",
      "asistencia_capacitaciones",
      "capacitaciones",
      "seguimiento_objetivos",
      "objetivos_calidad",
      "control_riesgos",
      "riesgos",
      "hallazgo_auditorias",
      "auditorias",
      "acciones_correctivas",
      "no_conformidades",
      "indicadores",
      "participante_procesos",
      "instancia_procesos",
      "etapa_procesos",
      "documento_procesos",
      "version_documentos",
      "documentos",
      "procesos",
      "rol_permisos",
      "usuario_roles",
      "permisos",
      "roles",
      "usuarios",
      "areas",
      "tickets",
    ];

    for (const table of tables) {
      await queryInterface.dropTable(table);
    }
  },
};
