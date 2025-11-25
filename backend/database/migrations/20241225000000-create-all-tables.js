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

    // Create usuarios_roles junction table
    await queryInterface.createTable("usuarios_roles", {
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
      asignado_por: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      asignado_en: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create roles_permisos junction table
    await queryInterface.createTable("roles_permisos", {
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
      nombre_archivo: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      ruta_almacenamiento: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tipo_mime: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      tamaño_bytes: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      subido_por: {
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
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      revisado_por: {
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
        allowNull: true,
      },
      visibilidad: {
        type: Sequelize.STRING(50),
        defaultValue: "privado",
      },
      tipo_documento: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      codigo_documento: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      version: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      estado: {
        type: Sequelize.STRING(50),
        allowNull: true,
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
      fecha_aprobacion: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      proxima_revision: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      contenido_html: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });

    // Create versiones_documento table
    await queryInterface.createTable("versiones_documento", {
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
      numero_version: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      subido_en: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      subido_por: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      cambios: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ruta_archivo: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });

    // Create etapa_proceso table
    await queryInterface.createTable("etapa_proceso", {
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
      orden: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      rol_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      horas_maximas: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      permite_reapertura: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create instancias_proceso table
    await queryInterface.createTable("instancias_proceso", {
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
      iniciado_por: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      estado: {
        type: Sequelize.STRING,
        defaultValue: "borrador",
        allowNull: false,
      },
      iniciado_en: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      completado_en: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      etapa_actual_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "etapa_proceso",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      datos_dinamicos: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      bloqueado: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      razon_bloqueo: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Create documento_proceso junction table
    await queryInterface.createTable("documento_proceso", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      instancia_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "instancias_proceso",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      nota: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      adjuntado_en: {
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
      instancia_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "instancias_proceso",
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
      rol: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      creado_en: {
        type: Sequelize.DATE,
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
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      valor: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      periodo_inicio: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      periodo_fin: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      creado_en: {
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
      origen: {
        type: Sequelize.TEXT,
        allowNull: true,
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
        allowNull: true,
      },
      gravedad: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      fecha_deteccion: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      fecha_limite: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      fecha_cierre: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      actualizado_en: {
        type: Sequelize.DATEONLY,
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

    // Create auditoria table (audit log)
    await queryInterface.createTable("auditoria", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      usuario_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      tipo_entidad: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      entidad_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      accion: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      cambios: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      creado_en: {
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
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      tipo: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      alcance: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      objetivo: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      norma_referencia: {
        type: Sequelize.STRING(100),
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
      fecha_planificada: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      fecha_inicio: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      fecha_fin: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      estado: {
        type: Sequelize.STRING(50),
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

    // Create hallazgos_auditoria table
    await queryInterface.createTable("hallazgos_auditoria", {
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
      tipo: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      clausula_iso: {
        type: Sequelize.STRING(50),
        allowNull: true,
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
      evidencia: {
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

    // Create riesgos table
    await queryInterface.createTable("riesgos", {
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
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      categoria: {
        type: Sequelize.STRING(50),
        allowNull: true,
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
      probabilidad: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      impacto: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      nivel_riesgo: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      controles: {
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
        allowNull: true,
      },
      fecha_identificacion: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      fecha_revision: {
        type: Sequelize.DATEONLY,
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

    // Create controles_riesgo table
    await queryInterface.createTable("controles_riesgo", {
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
        allowNull: true,
      },
      tipo: {
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
      frecuencia: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      efectividad: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      creado_en: {
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
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
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
      meta: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      indicador_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "indicadores",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      valor_meta: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      periodo_inicio: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      periodo_fin: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      estado: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      creado_en: {
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
      objetivo_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "objetivos_calidad",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      periodo: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      valor_alcanzado: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      porcentaje_cumplimiento: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      registrado_por: {
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
      titulo: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tipo: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      instructor: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      duracion_horas: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      fecha_programada: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      fecha_realizacion: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      lugar: {
        type: Sequelize.STRING(200),
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
        allowNull: true,
      },
      creado_en: {
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
        allowNull: true,
      },
      calificacion: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      aprobado: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      comentarios: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      certificado_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create acciones_proceso table
    await queryInterface.createTable("acciones_proceso", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      instancia_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "instancias_proceso",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      etapa_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "etapa_proceso",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      ejecutado_por: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tipo_accion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      comentario: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ejecutado_en: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      tiempo_respuesta_segundos: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
      mensaje: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      datos: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      leida: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      entregado_en: {
        type: Sequelize.DATE,
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
      clave: {
        type: Sequelize.STRING(200),
        primaryKey: true,
        allowNull: false,
      },
      valor: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create campos_formulario table
    await queryInterface.createTable("campos_formulario", {
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
      etiqueta: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      clave_campo: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      tipo_campo: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      requerido: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      orden: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 0,
      },
      opciones: {
        type: Sequelize.JSON,
        allowNull: true,
      },
    });

    // Create respuestas_formulario table
    await queryInterface.createTable("respuestas_formulario", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      instancia_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "instancias_proceso",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      campo_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "campos_formulario",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      valor: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      creado_en: {
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
      instancia_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "instancias_proceso",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      creado_por: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      estado: {
        type: Sequelize.STRING(50),
        defaultValue: "abierto",
        allowNull: true,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      comentario: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      resuelto_en: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Create asignaciones table
    await queryInterface.createTable("asignaciones", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      area_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "areas",
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
      es_principal: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.addConstraint("usuarios_roles", {
      fields: ["usuario_id", "rol_id"],
      type: "unique",
      name: "usuario_roles_unique_constraint",
    });

    await queryInterface.addConstraint("roles_permisos", {
      fields: ["rol_id", "permiso_id"],
      type: "unique",
      name: "roles_permisos_unique_constraint",
    });

    await queryInterface.addConstraint("participante_procesos", {
      fields: ["instancia_id", "usuario_id"],
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
    await queryInterface.addIndex("no_conformidades", ["codigo"]);
    await queryInterface.addIndex("no_conformidades", ["proceso_id"]);
    await queryInterface.addIndex("no_conformidades", ["estado"]);
    await queryInterface.addIndex("auditorias", ["codigo"]);
    await queryInterface.addIndex("auditorias", ["estado"]);
    await queryInterface.addIndex("riesgos", ["codigo"]);
    await queryInterface.addIndex("riesgos", ["proceso_id"]);
    await queryInterface.addIndex("objetivos_calidad", ["codigo"]);
    await queryInterface.addIndex("notificaciones", ["usuario_id"]);
    await queryInterface.addIndex("notificaciones", ["leida"]);
    await queryInterface.addIndex("instancias_proceso", ["estado"], {
      name: "idx_instancia_estado",
    });
    await queryInterface.addIndex("acciones_proceso", ["instancia_id"], {
      name: "idx_acciones_instancias",
    });
    await queryInterface.addIndex("auditoria", ["tipo_entidad", "entidad_id"], {
      name: "idx_auditoria_entidad",
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop tables in reverse order to handle foreign key constraints
    const tables = [
      "respuestas_formulario",
      "campos_formulario",
      "tickets",
      "documento_proceso",
      "acciones_proceso",
      "participante_procesos",
      "instancias_proceso",
      "etapa_proceso",
      "configuraciones",
      "notificaciones",
      "asistencia_capacitaciones",
      "capacitaciones",
      "seguimiento_objetivos",
      "objetivos_calidad",
      "controles_riesgo",
      "riesgos",
      "hallazgos_auditoria",
      "auditorias",
      "auditoria",
      "acciones_correctivas",
      "no_conformidades",
      "indicadores",
      "versiones_documento",
      "documentos",
      "procesos",
      "roles_permisos",
      "usuarios_roles",
      "permisos",
      "roles",
      "asignaciones",
      "usuarios",
      "areas",
    ];

    for (const table of tables) {
      await queryInterface.dropTable(table);
    }
  },
};
