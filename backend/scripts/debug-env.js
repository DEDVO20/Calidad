// scripts/debug-env.js
const dotenv = require('dotenv');
const { URL } = require('url');

// Cargar variables de entorno
dotenv.config();

console.log('\n🔍 DIAGNÓSTICO DE VARIABLES DE ENTORNO\n');
console.log('=' .repeat(60));

// 1. Verificar USE_CLOUD
const USE_CLOUD = process.env.USE_CLOUD;
console.log('\n1️⃣  Configuración de Ambiente:');
console.log(`   USE_CLOUD: ${USE_CLOUD}`);
console.log(`   Tipo: ${typeof USE_CLOUD}`);
console.log(`   Es true?: ${USE_CLOUD === 'true'}`);

// 2. Verificar DATABASE_URL_CLOUD
const DATABASE_URL_CLOUD = process.env.DATABASE_URL_CLOUD;
console.log('\n2️⃣  URL de Supabase:');
console.log(`   Existe: ${!!DATABASE_URL_CLOUD}`);
console.log(`   Longitud: ${DATABASE_URL_CLOUD ? DATABASE_URL_CLOUD.length : 0} caracteres`);
console.log(`   Tipo: ${typeof DATABASE_URL_CLOUD}`);

if (DATABASE_URL_CLOUD) {
  console.log(`\n   URL completa:`);
  console.log(`   ${DATABASE_URL_CLOUD}`);

  try {
    // Parsear la URL
    const dbUrl = new URL(DATABASE_URL_CLOUD);

    console.log('\n3️⃣  Componentes de la URL parseada:');
    console.log(`   Protocolo: ${dbUrl.protocol}`);
    console.log(`   Usuario: ${dbUrl.username}`);
    console.log(`   Contraseña existe: ${!!dbUrl.password}`);
    console.log(`   Contraseña longitud: ${dbUrl.password ? dbUrl.password.length : 0} caracteres`);
    console.log(`   Contraseña tipo: ${typeof dbUrl.password}`);
    console.log(`   Contraseña valor: ${dbUrl.password ? '***' + dbUrl.password.slice(-4) : 'undefined'}`);
    console.log(`   Host: ${dbUrl.hostname}`);
    console.log(`   Puerto: ${dbUrl.port}`);
    console.log(`   Base de datos: ${dbUrl.pathname.slice(1)}`);

    // Verificar si la contraseña contiene caracteres especiales no codificados
    if (dbUrl.password && dbUrl.password.includes('@')) {
      console.log('\n⚠️  ADVERTENCIA: La contraseña contiene @ sin codificar');
      console.log('   Esto puede causar problemas de conexión');
      console.log('   Debes reemplazar @ por %40 en el .env');
    }

    if (dbUrl.password && typeof dbUrl.password !== 'string') {
      console.log('\n❌ ERROR: La contraseña NO es un string');
    } else if (dbUrl.password === '') {
      console.log('\n❌ ERROR: La contraseña está vacía');
    } else if (!dbUrl.password) {
      console.log('\n❌ ERROR: La contraseña es undefined o null');
    } else {
      console.log('\n✅ La contraseña es un string válido');
    }

  } catch (error) {
    console.log('\n❌ Error al parsear la URL:');
    console.log(`   ${error.message}`);
  }
}

// 3. Variables locales
console.log('\n4️⃣  Configuración Local (backup):');
console.log(`   DB_NAME: ${process.env.DB_NAME || 'no definido'}`);
console.log(`   DB_USER: ${process.env.DB_USER || 'no definido'}`);
console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '***' : 'no definido'}`);
console.log(`   DB_HOST: ${process.env.DB_HOST || 'no definido'}`);
console.log(`   DB_PORT: ${process.env.DB_PORT || 'no definido'}`);

// 4. Todas las variables que empiezan con DB o DATABASE
console.log('\n5️⃣  Todas las variables DB/DATABASE:');
Object.keys(process.env)
  .filter(key => key.startsWith('DB') || key.startsWith('DATABASE'))
  .forEach(key => {
    const value = process.env[key];
    if (key.includes('PASSWORD') || key.includes('URL')) {
      console.log(`   ${key}: ${value ? '*** (definido)' : 'no definido'}`);
    } else {
      console.log(`   ${key}: ${value || 'no definido'}`);
    }
  });

console.log('\n' + '='.repeat(60));

// Recomendaciones
console.log('\n💡 RECOMENDACIONES:\n');

if (USE_CLOUD === 'true' && DATABASE_URL_CLOUD) {
  console.log('✅ Configurado para usar Supabase');
  console.log('\n   Verifica que la URL esté en el formato:');
  console.log('   postgresql://postgres.xxx:PASSWORD@host:6543/postgres');
  console.log('\n   Si la contraseña tiene caracteres especiales (@, #, %, etc.),');
  console.log('   deben estar codificados en URL:');
  console.log('   @ → %40');
  console.log('   # → %23');
  console.log('   % → %25');
  console.log('   & → %26');
} else if (USE_CLOUD === 'false') {
  console.log('✅ Configurado para usar base de datos local');
} else {
  console.log('⚠️  USE_CLOUD no está configurado correctamente');
  console.log('   Ejecuta: npm run env:cloud  o  npm run env:local');
}

console.log('\n');
