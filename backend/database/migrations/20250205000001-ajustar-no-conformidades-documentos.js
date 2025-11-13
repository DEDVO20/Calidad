"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ===================================
    // AJUSTES A TABLA no_conformidades
    // ===================================
    
    // 1. Cambiar tipo de detectado_por de UUID a STRING si es necesario
    // Nota: Mantener UUID es mejor, así que cambiamos el modelo, no la migración
    
    // 2. Agregar columnas que tiene el modelo pero no la tabla
    await queryInterface.addColumn("no_conformidades", "area_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "areas",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("no_conformidades", "origen", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("no_conformidades", "gravedad", {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn("no_conformidades", "fecha_limite", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // 3. Cambiar tipo de STRING(100) a STRING(50) para codigo
    // No es necesario, STRING(50) en modelo puede leer STRING(100) en BD

    // ===================================
    // AJUSTES A TABLA documentos
    // ===================================

    // 1. Agregar columnas que el modelo tiene
    await queryInterface.addColumn("documentos", "nombre_archivo", {
      type: Sequelize.STRING(500),
      allowNull: false,
      defaultValue: "documento.pdf", // temporal para registros existentes
    });

    await queryInterface.addColumn("documentos", "ruta_almacenamiento", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("documentos", "tipo_mime", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn("documentos", "tamaño_bytes", {
      type: Sequelize.BIGINT,
      allowNull: true,
    });

    await queryInterface.addColumn("documentos", "subido_por", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "usuarios",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("documentos", "revisado_por", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "usuarios",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("documentos", "visibilidad", {
      type: Sequelize.STRING(50),
      allowNull: true,
      defaultValue: "privado",
    });

    await queryInterface.addColumn("documentos", "codigo_documento", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn("documentos", "proxima_revision", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("documentos", "contenido_html", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // 2. Renombrar columnas existentes para que coincidan con el modelo
    // Nota: ruta_archivo existe, se mantiene como alternativa a ruta_almacenamiento
    // tipo_documento existe y coincide
    // fecha_vigencia se mantiene, proxima_revision es adicional

    // 3. Cambiar version_actual a solo version en el modelo (no en BD)
    // El modelo usará field: "version_actual"

    console.log("✅ Migración completada: ajustes a no_conformidades y documentos");
  },

  async down(queryInterface, Sequelize) {
    // Revertir cambios en no_conformidades
    await queryInterface.removeColumn("no_conformidades", "area_id");
    await queryInterface.removeColumn("no_conformidades", "origen");
    await queryInterface.removeColumn("no_conformidades", "gravedad");
    await queryInterface.removeColumn("no_conformidades", "fecha_limite");

    // Revertir cambios en documentos
    await queryInterface.removeColumn("documentos", "nombre_archivo");
    await queryInterface.removeColumn("documentos", "ruta_almacenamiento");
    await queryInterface.removeColumn("documentos", "tipo_mime");
    await queryInterface.removeColumn("documentos", "tamaño_bytes");
    await queryInterface.removeColumn("documentos", "subido_por");
    await queryInterface.removeColumn("documentos", "revisado_por");
    await queryInterface.removeColumn("documentos", "visibilidad");
    await queryInterface.removeColumn("documentos", "codigo_documento");
    await queryInterface.removeColumn("documentos", "proxima_revision");
    await queryInterface.removeColumn("documentos", "contenido_html");

    console.log("✅ Rollback completado");
  },
};
