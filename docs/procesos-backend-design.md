# Diseño backend para Procesos

Objetivo: definir tablas y endpoints necesarios para soportar `Proceso`, `Etapa` y `PuntoDeControl`.

Tablas propuestas (Postgres/Sequelize):

- procesos
  - id (uuid, PK)
  - codigo (string)
  - nombre (string)
  - descripcion (text)
  - inicio (string)
  - fechaInicio (date)
  - sitio (string)
  - responsableId (uuid, FK -> usuarios.id)
  - estado (string)
  - creadoEn, actualizadoEn

- etapas
  - id (uuid, PK)
  - procesoId (uuid, FK -> procesos.id)
  - nombre (string)
  - descripcion (text)
  - responsableId (uuid, FK -> usuarios.id)
  - orden (integer)
  - creadoEn, actualizadoEn

- puntos_control
  - id (uuid, PK)
  - procesoId (uuid, FK -> procesos.id)
  - nombre (string)
  - criterio (text)
  - frecuencia (string)
  - indicadorId (uuid, FK -> indicadores.id) OPTIONAL
  - creadoEn, actualizadoEn

Relaciones:
- proceso hasMany etapas
- proceso hasMany puntos_control
- etapa belongsTo usuario (responsable)
- proceso belongsTo usuario (responsable)

Endpoints REST sugeridos:

- GET /api/procesos
- GET /api/procesos/:id
- POST /api/procesos
- PUT /api/procesos/:id
- DELETE /api/procesos/:id

- GET /api/procesos/:procesoId/etapas
- POST /api/procesos/:procesoId/etapas
- PUT /api/etapas/:id
- DELETE /api/etapas/:id

- GET /api/procesos/:procesoId/puntos-control
- POST /api/procesos/:procesoId/puntos-control
- PUT /api/puntos-control/:id
- DELETE /api/puntos-control/:id

Notas de implementación:
- Validar permisos con middleware `auth` y `roles`.
- Al obtener `GET /api/procesos` devolver `etapas` y `puntosControl` si se pasa `?includeDetails=true`.
- Añadir índices para búsquedas por `codigo` y `responsableId`.

Ejemplo payload creación proceso:

```json
{
  "codigo": "PR-001",
  "nombre": "Proceso compras",
  "descripcion": "...",
  "inicio": "Solicitud",
  "fechaInicio": "2026-01-01",
  "sitio": "Planta A",
  "responsableId": "uuid-usuario",
  "etapas": [ { "nombre": "Recepción", "orden": 1, "responsableId": "..." } ],
  "puntosControl": [ { "nombre": "Verificación factura", "criterio": "Documento correcto" } ]
}
```
