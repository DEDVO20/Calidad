// scripts/switch-env.js
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
const args = process.argv.slice(2);
const environment = args[0];

if (!environment || !['local', 'cloud'].includes(environment)) {
  console.log('❌ Uso incorrecto del comando\n');
  console.log('📖 Uso:');
  console.log('   npm run env:local  - Cambiar a conexión local');
  console.log('   npm run env:cloud  - Cambiar a conexión en la nube (Supabase)');
  process.exit(1);
}

try {
  // Verificar si existe .env
  if (!fs.existsSync(envPath)) {
    console.error('❌ El archivo .env no existe.');
    console.log('💡 Crea uno basándote en .env.example');
    process.exit(1);
  }

  // Leer el archivo .env
  let envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  let modified = false;

  // Buscar y modificar USE_CLOUD
  let foundUseCloud = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('USE_CLOUD=') || lines[i].startsWith('USE_CLOUD =')) {
      foundUseCloud = true;
      const newValue = environment === 'cloud' ? 'true' : 'false';
      lines[i] = `USE_CLOUD=${newValue}`;
      modified = true;
      break;
    }
  }

  // Si no existe USE_CLOUD, agregarlo
  if (!foundUseCloud) {
    const newValue = environment === 'cloud' ? 'true' : 'false';
    lines.push('');
    lines.push('# Configuración de ambiente');
    lines.push(`USE_CLOUD=${newValue}`);
    modified = true;
  }

  if (modified) {
    // Guardar los cambios
    fs.writeFileSync(envPath, lines.join('\n'), 'utf-8');

    console.log('\n' + '='.repeat(60));
    if (environment === 'local') {
      console.log('✅ Configuración cambiada a CONEXIÓN LOCAL');
      console.log('💻 Ahora se usará la base de datos PostgreSQL local');
      console.log('\n📋 Verifica que estas variables estén en tu .env:');
      console.log('   DB_HOST=localhost');
      console.log('   DB_PORT=5432');
      console.log('   DB_NAME=calidad');
      console.log('   DB_USER=postgres');
      console.log('   DB_PASSWORD=tu_password');
    } else {
      console.log('✅ Configuración cambiada a CONEXIÓN EN LA NUBE');
      console.log('☁️  Ahora se usará Supabase');
      console.log('\n⚠️  Asegúrate de tener configurada la variable en el .env:');
      console.log('   DATABASE_URL_CLOUD=postgresql://...');
    }

    console.log('\n🔄 IMPORTANTE: Reinicia tu servidor para aplicar los cambios');
    console.log('   Ctrl + C (si está corriendo)');
    console.log('   npm run dev (para reiniciar)');

    console.log('\n🧪 Puedes verificar la conexión con:');
    console.log('   npm run test:cloud');
    console.log('='.repeat(60) + '\n');
  } else {
    console.log('⚠️  No se realizaron cambios');
  }

} catch (error) {
  console.error('❌ Error al cambiar el ambiente:', error.message);
  process.exit(1);
}
