# Base de Datos - Sistema de Gestión de Calidad ISO 9001

Este directorio contiene las migraciones y seeders para el Sistema de Gestión de Calidad basado en la norma ISO 9001:2015.

## 📋 Estructura de la Base de Datos

La base de datos incluye las siguientes entidades principales:

### 🏢 Gestión Organizacional
- **Areas**: Áreas funcionales de la organización
- **Usuarios**: Personal de la organización
- **Roles**: Roles del sistema con permisos específicos
- **Permisos**: Permisos granulares del sistema

### 📋 Procesos
- **Procesos**: Procesos del SGC (estratégicos, operativos, apoyo)
- **Etapa_Procesos**: Etapas individuales de cada proceso
- **Instancia_Procesos**: Instancias ejecutadas de procesos
- **Participante_Procesos**: Participantes en instancias de procesos

### 📄 Documentos
- **Documentos**: Documentos del SGC
- **Version_Documentos**: Control de versiones
- **Documento_Procesos**: Relación documentos-procesos

### 📊 Indicadores y Objetivos
- **Indicadores**: Indicadores de desempeño de procesos
- **Objetivos_Calidad**: Objetivos de calidad organizacionales
- **Seguimiento_Objetivos**: Seguimiento de objetivos

### 🔍 Auditorías
- **Auditorias**: Auditorías internas y externas
- **Hallazgo_Auditorias**: Hallazgos de auditorías

### ⚠️ No Conformidades y Acciones
- **No_Conformidades**: Registro de no conformidades
- **acciones_correctivas**: Acciones correctivas y preventivas
- **Accion_Procesos**: Acciones de mejora en procesos

### 🎯 Gestión de Riesgos
- **Riesgos**: Matriz de riesgos
- **Control_Riesgos**: Controles implementados

### 👥 Capacitación
- **Capacitaciones**: Programa de capacitaciones
- **Asistencia_Capacitaciones**: Registro de asistencia

### 🔧 Sistema
- **Configuraciones**: Configuraciones del sistema
- **Notificaciones**: Sistema de notificaciones
- **Tickets**: Sistema de tickets de soporte
- **Campo_Formularios**: Formularios dinámicos
- **Respuesta_Formularios**: Respuestas a formularios

## 🚀 Configuración Inicial

### Prerrequisitos

1. **PostgreSQL** instalado y ejecutándose
2. **Node.js** y **npm** instalados
3. **Sequelize CLI** instalado globalmente:
   ```bash
   npm install -g sequelize-cli
   ```

### Variables de Entorno

Crea un archivo `.env` en la raíz del backend con:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sgc_iso9001
DB_USER=postgres
DB_PASSWORD=tu_password_aqui

# Aplicación
NODE_ENV=development
PORT=3000
JWT_SECRET=tu_jwt_secret_muy_seguro
```

### Configuración de la Base de Datos

El archivo `.sequelizerc` ya está configurado para usar:
- **Config**: `src/config/config.json`
- **Models**: `src/models/`
- **Migrations**: `database/migrations/`
- **Seeders**: `database/seeders/`

## 📦 Ejecutar Migraciones

### Opción 1: Script Automatizado (Recomendado)

```bash
# Crear base de datos, ejecutar migraciones y seeders
node scripts/run-migrations.js migrate

# Ver estado de migraciones
node scripts/run-migrations.js status

# Reiniciar base de datos completa
node scripts/run-migrations.js reset

# Ver ayuda
node scripts/run-migrations.js help
```

### Opción 2: Comandos Manuales

```bash
# 1. Crear la base de datos (si no existe)
npx sequelize-cli db:create

# 2. Ejecutar todas las migraciones
npx sequelize-cli db:migrate

# 3. Ejecutar seeders (datos iniciales)
npx sequelize-cli db:seed:all

# 4. Ver estado de migraciones
npx sequelize-cli db:migrate:status
```

## 👤 Usuario Administrador Inicial

Después de ejecutar las migraciones y seeders, se crea un usuario administrador:

- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Email**: `admin@sgc.com`
- **Rol**: Administrador del Sistema

## 🔄 Comandos Útiles

### Deshacer Migraciones

```bash
# Deshacer última migración
npx sequelize-cli db:migrate:undo

# Deshacer todas las migraciones
npx sequelize-cli db:migrate:undo:all

# Deshacer seeders
npx sequelize-cli db:seed:undo:all
```

### Crear Nuevas Migraciones

```bash
# Crear nueva migración
npx sequelize-cli migration:generate --name nombre-de-la-migracion

# Crear nuevo seeder
npx sequelize-cli seed:generate --name nombre-del-seeder
```

## 📊 Datos Iniciales

El seeder inicial incluye:

### Áreas Predefinidas
- Gestión de Calidad (CAL)
- Sistemas y Tecnología (SIS)
- Recursos Humanos (RRHH)
- Comercial (COM)
- Operaciones (OPE)
- Finanzas (FIN)

### Roles del Sistema
- **Administrador**: Acceso completo
- **Coordinador de Calidad**: Gestión del SGC
- **Auditor Interno**: Auditorías internas
- **Responsable de Proceso**: Gestión de procesos
- **Usuario General**: Acceso básico
- **Invitado**: Solo lectura

### Permisos Granulares
- Gestión de usuarios
- Procesos y documentos
- Auditorías y hallazgos
- No conformidades y acciones
- Riesgos y controles
- Indicadores y objetivos
- Capacitaciones
- Configuración del sistema

### Procesos de Ejemplo
- Gestión del Sistema de Calidad
- Venta de Servicios
- Gestión de Recursos Humanos
- Gestión Financiera

### Configuraciones del Sistema
- Información de la empresa
- Criterios de evaluación de riesgos
- Configuración de notificaciones
- Parámetros de auditorías

## 🔧 Troubleshooting

### Error de Conexión a la Base de Datos

1. Verifica que PostgreSQL esté ejecutándose:
   ```bash
   # Windows
   services.msc (buscar PostgreSQL)
   
   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. Verifica las credenciales en el archivo `.env`

3. Verifica que la base de datos exista:
   ```sql
   CREATE DATABASE sgc_iso9001;
   ```

### Error de Permisos

Asegúrate de que el usuario de PostgreSQL tenga permisos para:
- Crear bases de datos
- Crear tablas
- Insertar datos

### Error de Sequelize CLI

```bash
# Reinstalar Sequelize CLI globalmente
npm uninstall -g sequelize-cli
npm install -g sequelize-cli
```

## 📝 Desarrollo

### Agregar Nueva Tabla

1. Crear migración:
   ```bash
   npx sequelize-cli migration:generate --name create-nueva-tabla
   ```

2. Editar el archivo de migración en `database/migrations/`

3. Crear/actualizar el modelo en `src/models/`

4. Ejecutar migración:
   ```bash
   npx sequelize-cli db:migrate
   ```

### Modificar Tabla Existente

1. **NUNCA** modifiques una migración ya ejecutada
2. Crea una nueva migración para los cambios:
   ```bash
   npx sequelize-cli migration:generate --name modify-tabla-existente
   ```

3. Usa `addColumn`, `removeColumn`, `changeColumn`, etc.

## 🔒 Seguridad

- Las contraseñas se almacenan hasheadas con bcrypt
- Los IDs son UUIDs para mayor seguridad
- Se implementan restricciones de integridad referencial
- Los permisos son granulares y basados en roles

## 📚 Documentación Adicional

- [Sequelize Documentation](https://sequelize.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Norma ISO 9001:2015](https://www.iso.org/iso-9001-quality-management.html)

## 🤝 Contribución

1. Siempre crear respaldo antes de modificar migraciones
2. Probar migraciones en entorno de desarrollo
3. Documentar cambios en el README
4. Mantener consistencia en nomenclatura
5. Validar integridad referencial

---

**Versión**: 1.0  
**Última actualización**: Diciembre 2024  
**Compatible con**: PostgreSQL 12+, Node.js 16+, Sequelize 6+