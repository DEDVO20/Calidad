'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('asignaciones', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      area_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'areas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      usuario_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      es_principal: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Indica si es el responsable principal del área'
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Crear índices para mejorar el rendimiento de las consultas
    await queryInterface.addIndex('asignaciones', ['area_id'], {
      name: 'asignaciones_area_id_idx'
    });

    await queryInterface.addIndex('asignaciones', ['usuario_id'], {
      name: 'asignaciones_usuario_id_idx'
    });

    // Crear constraint único para evitar duplicados de la misma asignación
    await queryInterface.addConstraint('asignaciones', {
      fields: ['area_id', 'usuario_id'],
      type: 'unique',
      name: 'asignaciones_area_usuario_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('asignaciones');
  }
};
