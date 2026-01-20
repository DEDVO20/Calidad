'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Helper para verificar si una columna existe
        const columnExists = async (tableName, columnName) => {
            const [results] = await queryInterface.sequelize.query(
                `SELECT column_name FROM information_schema.columns 
         WHERE table_name = '${tableName}' AND column_name = '${columnName}';`
            );
            return results.length > 0;
        };

        // IMPORTANTE: La tabla se llama "version_documentos" (no "versiones_documento")
        const tableName = 'version_documentos';

        // Agregar columnas nuevas solo si no existen
        if (!(await columnExists(tableName, 'version_string'))) {
            await queryInterface.addColumn(tableName, 'version_string', {
                type: Sequelize.STRING(20),
                allowNull: true, // Inicialmente nullable
            });

            // Migrar datos existentes
            await queryInterface.sequelize.query(`
        UPDATE ${tableName} 
        SET version_string = CONCAT(numero_version, '.0')
        WHERE version_string IS NULL
      `);

            // Hacer NOT NULL después de migrar datos
            await queryInterface.changeColumn(tableName, 'version_string', {
                type: Sequelize.STRING(20),
                allowNull: false,
            });
            console.log('✅ Campo version_string agregado');
        }

        if (!(await columnExists(tableName, 'archivo_url'))) {
            await queryInterface.addColumn(tableName, 'archivo_url', {
                type: Sequelize.TEXT,
                allowNull: true,
            });
            console.log('✅ Campo archivo_url agregado');
        }

        if (!(await columnExists(tableName, 'estado'))) {
            await queryInterface.addColumn(tableName, 'estado', {
                type: Sequelize.STRING(20),
                allowNull: true,
                defaultValue: 'historica',
            });
            console.log('✅ Campo estado agregado');
        }

        if (!(await columnExists(tableName, 'nombre_archivo'))) {
            await queryInterface.addColumn(tableName, 'nombre_archivo', {
                type: Sequelize.STRING(500),
                allowNull: true,
            });
            console.log('✅ Campo nombre_archivo agregado');
        }

        if (!(await columnExists(tableName, 'tamaño_bytes'))) {
            await queryInterface.addColumn(tableName, 'tamaño_bytes', {
                type: Sequelize.BIGINT,
                allowNull: true,
            });
            console.log('✅ Campo tamaño_bytes agregado');
        }
    },

    async down(queryInterface, Sequelize) {
        const tableName = 'version_documentos';

        // Revertir los cambios en caso de rollback
        await queryInterface.removeColumn(tableName, 'version_string');
        await queryInterface.removeColumn(tableName, 'archivo_url');
        await queryInterface.removeColumn(tableName, 'estado');
        await queryInterface.removeColumn(tableName, 'nombre_archivo');
        await queryInterface.removeColumn(tableName, 'tamaño_bytes');
    }
};
