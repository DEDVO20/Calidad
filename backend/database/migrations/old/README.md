# README - Migraciones Antiguas

Este directorio contiene las migraciones originales que han sido consolidadas en la migración `20260106000000-consolidated-schema.js`.

## ⚠️ IMPORTANTE

**NO ejecutes estas migraciones si estás creando un nuevo entorno.** Usa la migración consolidada en su lugar.

## Migraciones Archivadas

Estas migraciones ya fueron ejecutadas en la base de datos de producción/desarrollo existente:

1. **20241225000000-create-all-tables.js** - Creación inicial de todas las tablas
2. **20250128000000-add-foto-url-to-usuarios.js** - Agrega campo foto_url a usuarios
3. **20250130000000-update-indicadores-table.js** - Agrega campos adicionales a indicadores
4. **20250205000000-create-asignaciones-table.js** - Crea tabla asignaciones (duplicada con #1)
5. **20251205161611-add-version-fields.js** - Agrega campos de versión a version_documentos
6. **20251205181828-add-rejection-fields.js** - Agrega campos de rechazo a documentos
7. **20251206154012-add-version-snapshot-fields.js** - Agrega campos de snapshot a version_documentos

## Historial

Fecha de consolidación: 2026-01-06
Migración consolidada: `20260106000000-consolidated-schema.js`

## ¿Por qué se archivaron?

- **Reducir complejidad**: Una sola migración es más fácil de mantener
- **Evitar errores**: La migración #4 estaba duplicada con la #1
- **Nuevos entornos**: Una migración limpia para despliegues frescos
- **Mantener historial**: Estas migraciones se preservan para referencia
