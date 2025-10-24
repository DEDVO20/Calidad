#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');
require('dotenv').config();

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    log(`Ejecutando: ${command}`, colors.cyan);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        log(`Error: ${error.message}`, colors.red);
        reject(error);
        return;
      }
      if (stderr) {
        log(`Advertencia: ${stderr}`, colors.yellow);
      }
      if (stdout) {
        log(stdout, colors.reset);
      }
      resolve(stdout);
    });
  });
}

async function checkDatabaseConnection() {
  log('\n🔍 Verificando conexión a la base de datos...', colors.blue);

  try {
    const sequelize = require('../src/config/database');
    await sequelize.authenticate();
    log('✅ Conexión a la base de datos exitosa', colors.green);
    await sequelize.close();
    return true;
  } catch (error) {
    log(`❌ Error de conexión a la base de datos: ${error.message}`, colors.red);
    log('\n💡 Asegúrate de que:', colors.yellow);
    log('  - PostgreSQL esté ejecutándose', colors.yellow);
    log('  - Las credenciales en .env sean correctas', colors.yellow);
    log('  - La base de datos exista', colors.yellow);
    return false;
  }
}

async function runMigrations() {
  log('\n🚀 Iniciando migración de la base de datos...', colors.bright);

  try {
    // Check database connection first
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    // Run migrations
    log('\n📋 Ejecutando migraciones...', colors.blue);
    await executeCommand('npx sequelize-cli db:migrate');
    log('✅ Migraciones ejecutadas correctamente', colors.green);

    // Run seeders
    log('\n🌱 Ejecutando seeders...', colors.blue);
    await executeCommand('npx sequelize-cli db:seed:all');
    log('✅ Datos iniciales insertados correctamente', colors.green);

    log('\n🎉 ¡Migración completada exitosamente!', colors.bright + colors.green);
    log('\n📝 Resumen de lo que se creó:', colors.blue);
    log('  ✓ 30+ tablas del sistema de gestión de calidad', colors.green);
    log('  ✓ Relaciones y restricciones de integridad', colors.green);
    log('  ✓ Índices para mejorar el rendimiento', colors.green);
    log('  ✓ Datos iniciales (áreas, roles, permisos, usuario admin)', colors.green);
    log('  ✓ Configuraciones del sistema', colors.green);
    log('  ✓ Procesos de ejemplo', colors.green);
    log('  ✓ Indicadores y objetivos de calidad', colors.green);

    log('\n🔑 Credenciales del administrador:', colors.magenta);
    log('  Usuario: admin', colors.cyan);
    log('  Contraseña: admin123', colors.cyan);
    log('  Email: admin@sgc.com', colors.cyan);

  } catch (error) {
    log(`\n❌ Error durante la migración: ${error.message}`, colors.red);
    process.exit(1);
  }
}

async function rollbackMigrations() {
  log('\n⏪ Deshaciendo última migración...', colors.yellow);

  try {
    await executeCommand('npx sequelize-cli db:migrate:undo');
    log('✅ Migración deshecha correctamente', colors.green);
  } catch (error) {
    log(`❌ Error al deshacer migración: ${error.message}`, colors.red);
    process.exit(1);
  }
}

async function rollbackAllMigrations() {
  log('\n⏪ Deshaciendo TODAS las migraciones...', colors.yellow);
  log('⚠️  Esto eliminará todas las tablas y datos', colors.red);

  try {
    await executeCommand('npx sequelize-cli db:migrate:undo:all');
    log('✅ Todas las migraciones deshecha correctamente', colors.green);
  } catch (error) {
    log(`❌ Error al deshacer migraciones: ${error.message}`, colors.red);
    process.exit(1);
  }
}

async function showMigrationStatus() {
  log('\n📊 Estado de las migraciones:', colors.blue);

  try {
    await executeCommand('npx sequelize-cli db:migrate:status');
  } catch (error) {
    log(`❌ Error al consultar estado: ${error.message}`, colors.red);
  }
}

async function resetDatabase() {
  log('\n🔄 Reiniciando base de datos completa...', colors.yellow);
  log('⚠️  Esto eliminará TODOS los datos', colors.red);

  try {
    await rollbackAllMigrations();
    await runMigrations();
    log('\n🎉 ¡Base de datos reiniciada exitosamente!', colors.bright + colors.green);
  } catch (error) {
    log(`❌ Error al reiniciar base de datos: ${error.message}`, colors.red);
    process.exit(1);
  }
}

async function createDatabase() {
  log('\n🏗️  Creando base de datos...', colors.blue);

  try {
    await executeCommand('npx sequelize-cli db:create');
    log('✅ Base de datos creada correctamente', colors.green);
  } catch (error) {
    if (error.message.includes('already exists')) {
      log('ℹ️  La base de datos ya existe', colors.yellow);
    } else {
      log(`❌ Error al crear base de datos: ${error.message}`, colors.red);
      process.exit(1);
    }
  }
}

function showHelp() {
  log('\n📖 Uso del script de migraciones:', colors.bright);
  log('\nComandos disponibles:', colors.blue);
  log('  migrate         - Ejecutar todas las migraciones y seeders', colors.green);
  log('  rollback        - Deshacer la última migración', colors.yellow);
  log('  rollback:all    - Deshacer todas las migraciones', colors.red);
  log('  status          - Mostrar estado de las migraciones', colors.cyan);
  log('  reset           - Reiniciar base de datos completa', colors.magenta);
  log('  create          - Crear base de datos', colors.blue);
  log('  help            - Mostrar esta ayuda', colors.reset);

  log('\nEjemplos:', colors.blue);
  log('  node scripts/run-migrations.js migrate', colors.cyan);
  log('  node scripts/run-migrations.js status', colors.cyan);
  log('  node scripts/run-migrations.js reset', colors.cyan);
}

async function main() {
  const command = process.argv[2];

  log('🗃️  Sistema de Gestión de Calidad - Migrador de Base de Datos', colors.bright + colors.blue);
  log('=' .repeat(60), colors.blue);

  switch (command) {
    case 'migrate':
      await runMigrations();
      break;
    case 'rollback':
      await rollbackMigrations();
      break;
    case 'rollback:all':
      await rollbackAllMigrations();
      break;
    case 'status':
      await showMigrationStatus();
      break;
    case 'reset':
      await resetDatabase();
      break;
    case 'create':
      await createDatabase();
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    default:
      log('❌ Comando no reconocido', colors.red);
      showHelp();
      process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  log('\n\n⏹️  Proceso interrumpido por el usuario', colors.yellow);
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  log(`\n❌ Error no capturado: ${error.message}`, colors.red);
  process.exit(1);
});

// Run the main function
main().catch((error) => {
  log(`\n❌ Error fatal: ${error.message}`, colors.red);
  process.exit(1);
});
