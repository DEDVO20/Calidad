const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'admin123',
    database: process.env.DB_NAME || 'calidad',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: console.log,
});

async function runMigration() {
    try {
        console.log('🔌 Conectando a la base de datos...');
        await sequelize.authenticate();
        console.log('✅ Conexión exitosa');

        console.log('\n📝 Ejecutando migración...');

        // Agregar columnas
        const queryInterface = sequelize.getQueryInterface();

        await queryInterface.addColumn('versiones_documento', 'version_string', {
            type: Sequelize.STRING(20),
            allowNull: true,
        });
        console.log('✅ Campo version_string agregado');

        await queryInterface.addColumn('versiones_documento', 'archivo_url', {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        console.log('✅ Campo archivo_url agregado');

        await queryInterface.addColumn('versiones_documento', 'estado', {
            type: Sequelize.STRING(20),
            allowNull: true,
            defaultValue: 'historica',
        });
        console.log('✅ Campo estado agregado');

        await queryInterface.addColumn('versiones_documento', 'nombre_archivo', {
            type: Sequelize.STRING(500),
            allowNull: true,
        });
        console.log('✅ Campo nombre_archivo agregado');

        await queryInterface.addColumn('versiones_documento', 'tamaño_bytes', {
            type: Sequelize.BIGINT,
            allowNull: true,
        });
        console.log('✅ Campo tamaño_bytes agregado');

        // Migrar datos existentes
        console.log('\n🔄 Migrando datos existentes...');
        await sequelize.query(`
      UPDATE versiones_documento 
      SET version_string = CONCAT(numero_version, '.0')
      WHERE version_string IS NULL
    `);
        console.log('✅ Datos migrados');

        // Hacer version_string NOT NULL
        await queryInterface.changeColumn('versiones_documento', 'version_string', {
            type: Sequelize.STRING(20),
            allowNull: false,
        });
        console.log('✅ Campo version_string configurado como NOT NULL');

        console.log('\n✨ Migración completada exitosamente!');
    } catch (error) {
        console.error('❌ Error en la migración:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

runMigration();
