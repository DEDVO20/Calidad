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

    const tableName = 'version_documentos';

    // Agregar campo para snapshot del contenido HTML
    if (!(await columnExists(tableName, 'contenido_html'))) {
      await queryInterface.addColumn(tableName, 'contenido_html', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
      console.log('✅ Campo contenido_html agregado');
    }

    // Agregar campo para snapshot del estado del documento
    if (!(await columnExists(tableName, 'estado_documento'))) {
      await queryInterface.addColumn(tableName, 'estado_documento', {
        type: Sequelize.STRING(50),
        allowNull: true,
      });
      console.log('✅ Campo estado_documento agregado');
    }

    // Agregar campo para snapshot del tipo de documento
    if (!(await columnExists(tableName, 'tipo_documento'))) {
      await queryInterface.addColumn(tableName, 'tipo_documento', {
        type: Sequelize.STRING(100),
        allowNull: true,
      });
      console.log('✅ Campo tipo_documento agregado');
    }

    // Agregar campo para snapshot del código de documento
    if (!(await columnExists(tableName, 'codigo_documento'))) {
      await queryInterface.addColumn(tableName, 'codigo_documento', {
        type: Sequelize.STRING(100),
        allowNull: true,
      });
      console.log('✅ Campo codigo_documento agregado');
    }

    // Agregar campo para metadata adicional en JSON
    if (!(await columnExists(tableName, 'metadata_snapshot'))) {
      await queryInterface.addColumn(tableName, 'metadata_snapshot', {
        type: Sequelize.JSONB,
        allowNull: true,
      });
      console.log('✅ Campo metadata_snapshot agregado');
    }

    // Agregar campo para indicar si la versión tiene archivo o es solo metadata
    if (!(await columnExists(tableName, 'tiene_archivo'))) {
      await queryInterface.addColumn(tableName, 'tiene_archivo', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
      console.log('✅ Campo tiene_archivo agregado');
    }
  },

  async down(queryInterface, Sequelize) {
    const tableName = 'version_documentos';

    // Revertir los cambios en caso de rollback
    await queryInterface.removeColumn(tableName, 'contenido_html');
    await queryInterface.removeColumn(tableName, 'estado_documento');
    await queryInterface.removeColumn(tableName, 'tipo_documento');
    await queryInterface.removeColumn(tableName, 'codigo_documento');
    await queryInterface.removeColumn(tableName, 'metadata_snapshot');
    await queryInterface.removeColumn(tableName, 'tiene_archivo');
    console.log('✅ Campos de snapshot removidos');
  }
};
