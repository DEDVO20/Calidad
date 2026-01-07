'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Agregar campos para manejo de rechazos de aprobación

        // 1. Comentarios de rechazo
        await queryInterface.addColumn('documentos', 'comentarios_rechazo', {
            type: Sequelize.TEXT,
            allowNull: true,
        });

        // 2. Usuario que rechazó
        await queryInterface.addColumn('documentos', 'rechazado_por', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'usuarios',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });

        // 3. Fecha de rechazo
        await queryInterface.addColumn('documentos', 'fecha_rechazo', {
            type: Sequelize.DATE,
            allowNull: true,
        });

        console.log('✅ Campos de rechazo agregados a la tabla documentos');
    },

    async down(queryInterface, Sequelize) {
        // Revertir los cambios
        await queryInterface.removeColumn('documentos', 'comentarios_rechazo');
        await queryInterface.removeColumn('documentos', 'rechazado_por');
        await queryInterface.removeColumn('documentos', 'fecha_rechazo');
    }
};
