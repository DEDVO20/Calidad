/**
 * Script para verificar si la base de datos guarda y devuelve correctamente foto_url
 */

const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Conectar a la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

async function verificarFotoUrl() {
  try {
    console.log('🔌 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa\n');

    // 1. Verificar estructura de la tabla
    console.log('📋 VERIFICANDO ESTRUCTURA DE LA TABLA usuarios:');
    const [columns] = await sequelize.query(`
      SELECT column_name, data_type, character_maximum_length, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'usuarios' AND column_name = 'foto_url'
    `);
    
    if (columns.length === 0) {
      console.log('❌ La columna foto_url NO existe en la tabla usuarios');
      process.exit(1);
    }
    
    console.log('✅ Columna foto_url encontrada:');
    console.log(columns[0]);
    console.log('');

    // 2. Buscar usuario admin
    console.log('👤 BUSCANDO USUARIO ADMIN:');
    const [users] = await sequelize.query(`
      SELECT id, nombre, primer_apellido, nombre_usuario, foto_url
      FROM usuarios
      WHERE nombre_usuario = 'admin'
      LIMIT 1
    `);

    if (users.length === 0) {
      console.log('❌ No se encontró el usuario admin');
      process.exit(1);
    }

    const admin = users[0];
    console.log('✅ Usuario encontrado:');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Nombre: ${admin.nombre} ${admin.primer_apellido}`);
    console.log(`   Usuario: ${admin.nombre_usuario}`);
    console.log(`   foto_url: ${admin.foto_url || 'NULL'}`);
    console.log('');

    // 3. Verificar si hay algún usuario con foto_url
    console.log('📸 USUARIOS CON FOTO:');
    const [usersWithPhoto] = await sequelize.query(`
      SELECT nombre, primer_apellido, foto_url
      FROM usuarios
      WHERE foto_url IS NOT NULL AND foto_url != ''
    `);

    if (usersWithPhoto.length === 0) {
      console.log('⚠️  No hay ningún usuario con foto_url guardada');
      console.log('');
      console.log('💡 Esto significa que:');
      console.log('   1. Nunca se ha guardado una imagen, O');
      console.log('   2. El backend no está guardando correctamente la URL');
      console.log('');
      console.log('🔧 Para probar, ejecuta esta query:');
      console.log(`   UPDATE usuarios SET foto_url = 'https://clmtebtydzokhswddkla.supabase.co/storage/v1/object/public/imagenes/test.jpg' WHERE nombre_usuario = 'admin';`);
    } else {
      console.log(`✅ Se encontraron ${usersWithPhoto.length} usuario(s) con foto:`);
      usersWithPhoto.forEach(user => {
        console.log(`   - ${user.nombre} ${user.primer_apellido}`);
        console.log(`     URL: ${user.foto_url}`);
      });
    }
    console.log('');

    // 4. Probar UPDATE manual
    console.log('🧪 PROBANDO UPDATE MANUAL:');
    const testUrl = 'https://clmtebtydzokhswddkla.supabase.co/storage/v1/object/public/imagenes/test-' + Date.now() + '.jpg';
    
    await sequelize.query(`
      UPDATE usuarios 
      SET foto_url = :url 
      WHERE nombre_usuario = 'admin'
    `, {
      replacements: { url: testUrl }
    });

    const [updated] = await sequelize.query(`
      SELECT foto_url FROM usuarios WHERE nombre_usuario = 'admin'
    `);

    if (updated[0].foto_url === testUrl) {
      console.log('✅ UPDATE exitoso!');
      console.log(`   Valor guardado: ${updated[0].foto_url}`);
      
      // Restaurar valor original
      await sequelize.query(`
        UPDATE usuarios 
        SET foto_url = :url 
        WHERE nombre_usuario = 'admin'
      `, {
        replacements: { url: admin.foto_url }
      });
      console.log('✅ Valor restaurado al original');
    } else {
      console.log('❌ El UPDATE no funcionó correctamente');
    }
    console.log('');

    // 5. Verificar con Sequelize Model
    console.log('🔍 VERIFICANDO CON SEQUELIZE MODEL:');
    
    // Definir el modelo EXACTAMENTE como en usuario.model.ts
    const Usuario = sequelize.define('usuario', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      nombre: DataTypes.STRING,
      primerApellido: {
        type: DataTypes.STRING,
        field: 'primer_apellido',
      },
      nombreUsuario: {
        type: DataTypes.STRING,
        field: 'nombre_usuario',
      },
      fotoUrl: {
        type: DataTypes.STRING(500),
        field: 'foto_url',
      },
    }, {
      tableName: 'usuarios',
      timestamps: false,
      underscored: true,
    });

    // Agregar método toJSON personalizado
    Usuario.prototype.toJSON = function() {
      const values = { ...this.get({ plain: true }) };
      
      // Asegurar que fotoUrl esté disponible en ambos formatos
      if (this.fotoUrl) {
        values.fotoUrl = this.fotoUrl;  // camelCase
        values.foto_url = this.fotoUrl; // snake_case
      }
      
      return values;
    };

    const usuarioModel = await Usuario.findOne({
      where: { nombreUsuario: 'admin' },
      attributes: ['id', 'nombre', 'primerApellido', 'nombreUsuario', 'fotoUrl']
    });

    if (usuarioModel) {
      const json = usuarioModel.toJSON();
      console.log('✅ Usuario obtenido con Sequelize:');
      console.log(`   Nombre: ${json.nombre} ${json.primerApellido}`);
      console.log(`   fotoUrl (camelCase): ${json.fotoUrl || 'NULL'}`);
      console.log(`   foto_url (snake_case): ${json.foto_url || 'NULL'}`);
      
      if (!json.fotoUrl && !json.foto_url) {
        console.log('');
        console.log('⚠️  PROBLEMA DETECTADO:');
        console.log('   El modelo Sequelize tampoco está devolviendo foto_url');
        console.log('');
        console.log('💡 SOLUCIÓN:');
        console.log('   1. Asegúrate de que el backend esté usando el campo "fotoUrl" correctamente');
        console.log('   2. Verifica que el controlador esté recibiendo y guardando el valor');
        console.log('   3. Prueba subir una imagen desde el frontend');
      }
    }

    console.log('');
    console.log('='.repeat(60));
    console.log('✅ VERIFICACIÓN COMPLETADA');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

verificarFotoUrl();
