'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // La tabla indicadores ya tiene: id, proceso_id, nombre, descripcion, valor, periodo_inicio, periodo_fin, creado_en
    // Solo agregamos los campos que faltan
    
    await queryInterface.addColumn('indicadores', 'codigo', {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
      defaultValue: 'IND-TEMP', // Temporal para registros existentes
    });

    await queryInterface.addColumn('indicadores', 'tipo', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn('indicadores', 'formula', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('indicadores', 'unidad_medida', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn('indicadores', 'meta', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn('indicadores', 'frecuencia_medicion', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn('indicadores', 'responsable_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('indicadores', 'estado', {
      type: Sequelize.STRING(50),
      allowNull: true,
      defaultValue: 'activo',
    });

    await queryInterface.addColumn('indicadores', 'actualizado_en', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Generar códigos únicos para registros existentes
    await queryInterface.sequelize.query(`
      UPDATE indicadores 
      SET codigo = CONCAT('IND-', SUBSTRING(id::text, 1, 8))
      WHERE codigo = 'IND-TEMP';
    `);
  },

  async down(queryInterface, Sequelize) {
    // Revertir cambios - solo los campos que agregamos
    await queryInterface.removeColumn('indicadores', 'actualizado_en');
    await queryInterface.removeColumn('indicadores', 'estado');
    await queryInterface.removeColumn('indicadores', 'responsable_id');
    await queryInterface.removeColumn('indicadores', 'frecuencia_medicion');
    await queryInterface.removeColumn('indicadores', 'meta');
    await queryInterface.removeColumn('indicadores', 'unidad_medida');
    await queryInterface.removeColumn('indicadores', 'formula');
    await queryInterface.removeColumn('indicadores', 'tipo');
    await queryInterface.removeColumn('indicadores', 'codigo');
  }
};
