'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Insert initial areas
      const areasId = {
        calidad: uuidv4(),
        sistemas: uuidv4(),
        rrhh: uuidv4(),
        comercial: uuidv4(),
        operaciones: uuidv4(),
        finanzas: uuidv4(),
      };

      await queryInterface.bulkInsert('areas', [
        {
          id: areasId.calidad,
          codigo: 'CAL',
          nombre: 'Gestión de Calidad',
          descripcion: 'Área responsable del Sistema de Gestión de Calidad ISO 9001',
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
        {
          id: areasId.sistemas,
          codigo: 'SIS',
          nombre: 'Sistemas y Tecnología',
          descripcion: 'Área de desarrollo y soporte tecnológico',
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
        {
          id: areasId.rrhh,
          codigo: 'RRHH',
          nombre: 'Recursos Humanos',
          descripcion: 'Gestión del talento humano y desarrollo organizacional',
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
        {
          id: areasId.comercial,
          codigo: 'COM',
          nombre: 'Comercial',
          descripcion: 'Ventas, marketing y atención al cliente',
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
        {
          id: areasId.operaciones,
          codigo: 'OPE',
          nombre: 'Operaciones',
          descripcion: 'Procesos operativos y productivos',
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
        {
          id: areasId.finanzas,
          codigo: 'FIN',
          nombre: 'Finanzas',
          descripcion: 'Gestión financiera y contable',
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
      ], { transaction });

      // Insert initial roles
      const rolesId = {
        administrador: uuidv4(),
        coordinadorCalidad: uuidv4(),
        auditorInterno: uuidv4(),
        responsableProceso: uuidv4(),
        usuario: uuidv4(),
        invitado: uuidv4(),
      };

      await queryInterface.bulkInsert('roles', [
        {
          id: rolesId.administrador,
          nombre: 'Administrador del Sistema',
          clave: 'ADMIN',
          descripcion: 'Acceso completo al sistema',
          creado_en: new Date(),
        },
        {
          id: rolesId.coordinadorCalidad,
          nombre: 'Coordinador de Calidad',
          clave: 'COORD_CAL',
          descripcion: 'Coordinación general del SGC',
          creado_en: new Date(),
        },
        {
          id: rolesId.auditorInterno,
          nombre: 'Auditor Interno',
          clave: 'AUD_INT',
          descripcion: 'Realización de auditorías internas',
          creado_en: new Date(),
        },
        {
          id: rolesId.responsableProceso,
          nombre: 'Responsable de Proceso',
          clave: 'RESP_PROC',
          descripcion: 'Responsable de un proceso específico',
          creado_en: new Date(),
        },
        {
          id: rolesId.usuario,
          nombre: 'Usuario General',
          clave: 'USUARIO',
          descripcion: 'Usuario estándar del sistema',
          creado_en: new Date(),
        },
        {
          id: rolesId.invitado,
          nombre: 'Invitado',
          clave: 'INVITADO',
          descripcion: 'Acceso de solo lectura',
          creado_en: new Date(),
        },
      ], { transaction });

      // Insert initial permissions
      const permisos = [
        // Usuarios
        { codigo: 'USUARIOS_VER', nombre: 'Ver usuarios', descripcion: 'Visualizar lista de usuarios' },
        { codigo: 'USUARIOS_CREAR', nombre: 'Crear usuarios', descripcion: 'Crear nuevos usuarios' },
        { codigo: 'USUARIOS_EDITAR', nombre: 'Editar usuarios', descripcion: 'Modificar usuarios existentes' },
        { codigo: 'USUARIOS_ELIMINAR', nombre: 'Eliminar usuarios', descripcion: 'Eliminar usuarios del sistema' },

        // Procesos
        { codigo: 'PROCESOS_VER', nombre: 'Ver procesos', descripcion: 'Visualizar procesos' },
        { codigo: 'PROCESOS_CREAR', nombre: 'Crear procesos', descripcion: 'Crear nuevos procesos' },
        { codigo: 'PROCESOS_EDITAR', nombre: 'Editar procesos', descripcion: 'Modificar procesos' },
        { codigo: 'PROCESOS_ELIMINAR', nombre: 'Eliminar procesos', descripcion: 'Eliminar procesos' },

        // Documentos
        { codigo: 'DOCUMENTOS_VER', nombre: 'Ver documentos', descripcion: 'Visualizar documentos' },
        { codigo: 'DOCUMENTOS_CREAR', nombre: 'Crear documentos', descripcion: 'Crear nuevos documentos' },
        { codigo: 'DOCUMENTOS_EDITAR', nombre: 'Editar documentos', descripcion: 'Modificar documentos' },
        { codigo: 'DOCUMENTOS_ELIMINAR', nombre: 'Eliminar documentos', descripcion: 'Eliminar documentos' },
        { codigo: 'DOCUMENTOS_APROBAR', nombre: 'Aprobar documentos', descripcion: 'Aprobar documentos para publicación' },

        // Auditorías
        { codigo: 'AUDITORIAS_VER', nombre: 'Ver auditorías', descripcion: 'Visualizar auditorías' },
        { codigo: 'AUDITORIAS_CREAR', nombre: 'Crear auditorías', descripcion: 'Planificar auditorías' },
        { codigo: 'AUDITORIAS_EJECUTAR', nombre: 'Ejecutar auditorías', descripcion: 'Realizar auditorías' },
        { codigo: 'AUDITORIAS_CERRAR', nombre: 'Cerrar auditorías', descripcion: 'Cerrar y finalizar auditorías' },

        // No Conformidades
        { codigo: 'NC_VER', nombre: 'Ver no conformidades', descripcion: 'Visualizar no conformidades' },
        { codigo: 'NC_CREAR', nombre: 'Crear no conformidades', descripcion: 'Registrar no conformidades' },
        { codigo: 'NC_EDITAR', nombre: 'Editar no conformidades', descripcion: 'Modificar no conformidades' },
        { codigo: 'NC_CERRAR', nombre: 'Cerrar no conformidades', descripcion: 'Cerrar no conformidades' },

        // Acciones Correctivas
        { codigo: 'AC_VER', nombre: 'Ver acciones correctivas', descripcion: 'Visualizar acciones correctivas' },
        { codigo: 'AC_CREAR', nombre: 'Crear acciones correctivas', descripcion: 'Crear acciones correctivas' },
        { codigo: 'AC_EDITAR', nombre: 'Editar acciones correctivas', descripcion: 'Modificar acciones correctivas' },
        { codigo: 'AC_VERIFICAR', nombre: 'Verificar acciones correctivas', descripcion: 'Verificar efectividad' },

        // Riesgos
        { codigo: 'RIESGOS_VER', nombre: 'Ver riesgos', descripcion: 'Visualizar matriz de riesgos' },
        { codigo: 'RIESGOS_CREAR', nombre: 'Crear riesgos', descripcion: 'Registrar riesgos' },
        { codigo: 'RIESGOS_EDITAR', nombre: 'Editar riesgos', descripcion: 'Modificar riesgos' },
        { codigo: 'RIESGOS_EVALUAR', nombre: 'Evaluar riesgos', descripcion: 'Evaluar y valorar riesgos' },

        // Indicadores
        { codigo: 'INDICADORES_VER', nombre: 'Ver indicadores', descripcion: 'Visualizar indicadores' },
        { codigo: 'INDICADORES_CREAR', nombre: 'Crear indicadores', descripcion: 'Crear indicadores' },
        { codigo: 'INDICADORES_EDITAR', nombre: 'Editar indicadores', descripcion: 'Modificar indicadores' },
        { codigo: 'INDICADORES_MEDIR', nombre: 'Registrar mediciones', descripcion: 'Registrar mediciones de indicadores' },

        // Objetivos de Calidad
        { codigo: 'OBJETIVOS_VER', nombre: 'Ver objetivos', descripcion: 'Visualizar objetivos de calidad' },
        { codigo: 'OBJETIVOS_CREAR', nombre: 'Crear objetivos', descripcion: 'Crear objetivos de calidad' },
        { codigo: 'OBJETIVOS_EDITAR', nombre: 'Editar objetivos', descripcion: 'Modificar objetivos de calidad' },
        { codigo: 'OBJETIVOS_SEGUIMIENTO', nombre: 'Seguimiento objetivos', descripcion: 'Realizar seguimiento a objetivos' },

        // Capacitaciones
        { codigo: 'CAPACITACIONES_VER', nombre: 'Ver capacitaciones', descripcion: 'Visualizar capacitaciones' },
        { codigo: 'CAPACITACIONES_CREAR', nombre: 'Crear capacitaciones', descripcion: 'Programar capacitaciones' },
        { codigo: 'CAPACITACIONES_EDITAR', nombre: 'Editar capacitaciones', descripcion: 'Modificar capacitaciones' },
        { codigo: 'CAPACITACIONES_REGISTRAR', nombre: 'Registrar asistencia', descripcion: 'Registrar asistencia y evaluaciones' },

        // Configuración
        { codigo: 'CONFIG_VER', nombre: 'Ver configuración', descripcion: 'Visualizar configuración del sistema' },
        { codigo: 'CONFIG_EDITAR', nombre: 'Editar configuración', descripcion: 'Modificar configuración del sistema' },

        // Reportes
        { codigo: 'REPORTES_VER', nombre: 'Ver reportes', descripcion: 'Visualizar reportes del sistema' },
        { codigo: 'REPORTES_EXPORTAR', nombre: 'Exportar reportes', descripcion: 'Exportar reportes a diferentes formatos' },

        // Dashboard
        { codigo: 'DASHBOARD_VER', nombre: 'Ver dashboard', descripcion: 'Acceso al dashboard principal' },
      ];

      const permisosConId = permisos.map(permiso => ({
        id: uuidv4(),
        ...permiso,
        creado_en: new Date(),
      }));

      await queryInterface.bulkInsert('permisos', permisosConId, { transaction });

      // Create admin user
      const adminUserId = uuidv4();
      const hashedPassword = await bcrypt.hash('admin123', 10);

      await queryInterface.bulkInsert('usuarios', [
        {
          id: adminUserId,
          documento: 12345678,
          nombre: 'Administrador',
          primer_apellido: 'Sistema',
          correo_electronico: 'admin@sgc.com',
          nombre_usuario: 'admin',
          contrasena_hash: hashedPassword,
          area_id: areasId.calidad,
          activo: true,
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
      ], { transaction });

      // Assign admin role to admin user
      await queryInterface.bulkInsert('usuarios_roles', [
        {
          id: uuidv4(),
          usuario_id: adminUserId,
          rol_id: rolesId.administrador,
          asignado_en: new Date(),
        },
      ], { transaction });

      // Assign all permissions to admin role
      const rolPermisosAdmin = permisosConId.map(permiso => ({
        id: uuidv4(),
        rol_id: rolesId.administrador,
        permiso_id: permiso.id,
      }));

      await queryInterface.bulkInsert('roles_permisos', rolPermisosAdmin, { transaction });

      // Basic permissions for other roles
      const permisosBasicos = permisosConId.filter(p => p.codigo.includes('_VER'));

      // Coordinator role permissions
      const permisosCoordinador = permisosConId.filter(p =>
        p.codigo.includes('_VER') ||
        p.codigo.includes('_CREAR') ||
        p.codigo.includes('_EDITAR') ||
        p.codigo === 'DASHBOARD_VER' ||
        p.codigo === 'REPORTES_VER' ||
        p.codigo === 'REPORTES_EXPORTAR'
      );

      const rolPermisosCoordinador = permisosCoordinador.map(permiso => ({
        id: uuidv4(),
        rol_id: rolesId.coordinadorCalidad,
        permiso_id: permiso.id,
      }));

      await queryInterface.bulkInsert('roles_permisos', rolPermisosCoordinador, { transaction });

      // User role basic permissions
      const rolPermisosUsuario = permisosBasicos.map(permiso => ({
        id: uuidv4(),
        rol_id: rolesId.usuario,
        permiso_id: permiso.id,
      }));

      await queryInterface.bulkInsert('roles_permisos', rolPermisosUsuario, { transaction });

      // Insert initial configurations
      await queryInterface.bulkInsert('configuraciones', [
        {
          clave: 'EMPRESA_NOMBRE',
          valor: JSON.stringify('Mi Empresa SGC'),
          descripcion: 'Nombre de la empresa',
          actualizado_en: new Date(),
        },
        {
          clave: 'EMPRESA_NIT',
          valor: JSON.stringify('123456789-0'),
          descripcion: 'NIT de la empresa',
          actualizado_en: new Date(),
        },
        {
          clave: 'SGC_VERSION_NORMA',
          valor: JSON.stringify('ISO 9001:2015'),
          descripcion: 'Versión de la norma implementada',
          actualizado_en: new Date(),
        },
        {
          clave: 'NOTIFICACIONES_EMAIL',
          valor: JSON.stringify(true),
          descripcion: 'Habilitar notificaciones por email',
          actualizado_en: new Date(),
        },
        {
          clave: 'AUDITORIA_FRECUENCIA_DIAS',
          valor: JSON.stringify(365),
          descripcion: 'Frecuencia de auditorías internas en días',
          actualizado_en: new Date(),
        },
        {
          clave: 'RIESGO_MATRIZ_CRITERIOS',
          valor: JSON.stringify({"probabilidad": {"muy_baja": 1, "baja": 2, "media": 3, "alta": 4, "muy_alta": 5}, "impacto": {"muy_bajo": 1, "bajo": 2, "medio": 3, "alto": 4, "muy_alto": 5}}),
          descripcion: 'Criterios para evaluación de riesgos',
          actualizado_en: new Date(),
        },
      ], { transaction });

      // Insert sample processes
      const procesosId = {
        gestionCalidad: uuidv4(),
        ventaServicios: uuidv4(),
        gestionRRHH: uuidv4(),
        gestionFinanciera: uuidv4(),
      };

      await queryInterface.bulkInsert('procesos', [
        {
          id: procesosId.gestionCalidad,
          codigo: 'P-CAL-001',
          nombre: 'Gestión del Sistema de Calidad',
          area_id: areasId.calidad,
          objetivo: 'Establecer, implementar, mantener y mejorar continuamente el sistema de gestión de la calidad',
          alcance: 'Aplica a todos los procesos de la organización',
          etapa_phva: 'actuar',
          tipo_proceso: 'estrategico',
          responsable_id: adminUserId,
          estado: 'activo',
          version: '1.0',
          restringido: false,
          creado_por: adminUserId,
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
        {
          id: procesosId.ventaServicios,
          codigo: 'P-COM-001',
          nombre: 'Venta de Servicios',
          area_id: areasId.comercial,
          objetivo: 'Gestionar la venta de servicios desde la prospección hasta el cierre',
          alcance: 'Aplica al área comercial y sus actividades de venta',
          etapa_phva: 'hacer',
          tipo_proceso: 'operativo',
          responsable_id: adminUserId,
          estado: 'activo',
          version: '1.0',
          restringido: false,
          creado_por: adminUserId,
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
        {
          id: procesosId.gestionRRHH,
          codigo: 'P-RRHH-001',
          nombre: 'Gestión de Recursos Humanos',
          area_id: areasId.rrhh,
          objetivo: 'Asegurar la competencia del personal y su desarrollo profesional',
          alcance: 'Aplica a todos los colaboradores de la organización',
          etapa_phva: 'hacer',
          tipo_proceso: 'apoyo',
          responsable_id: adminUserId,
          estado: 'activo',
          version: '1.0',
          restringido: false,
          creado_por: adminUserId,
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
        {
          id: procesosId.gestionFinanciera,
          codigo: 'P-FIN-001',
          nombre: 'Gestión Financiera',
          area_id: areasId.finanzas,
          objetivo: 'Administrar los recursos financieros de manera eficiente',
          alcance: 'Aplica a todas las actividades financieras y contables',
          etapa_phva: 'hacer',
          tipo_proceso: 'apoyo',
          responsable_id: adminUserId,
          estado: 'activo',
          version: '1.0',
          restringido: false,
          creado_por: adminUserId,
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
      ], { transaction });

      // Insert sample indicators
      await queryInterface.bulkInsert('indicadores', [
        {
          id: uuidv4(),
          proceso_id: procesosId.gestionCalidad,
          nombre: 'Satisfacción del Cliente',
          descripcion: 'Porcentaje de satisfacción del cliente basado en encuestas',
          valor: 85.00,
          periodo_inicio: new Date('2025-01-01'),
          periodo_fin: new Date('2025-03-31'),
          creado_en: new Date(),
        },
        {
          id: uuidv4(),
          proceso_id: procesosId.ventaServicios,
          nombre: 'Cumplimiento de Metas de Ventas',
          descripcion: 'Porcentaje de cumplimiento de las metas mensuales de ventas',
          valor: 100.00,
          periodo_inicio: new Date('2025-01-01'),
          periodo_fin: new Date('2025-01-31'),
          creado_en: new Date(),
        },
        {
          id: uuidv4(),
          proceso_id: procesosId.gestionRRHH,
          nombre: 'Eficacia de la Capacitación',
          descripcion: 'Porcentaje de eficacia de los programas de capacitación',
          valor: 80.00,
          periodo_inicio: new Date('2025-01-01'),
          periodo_fin: new Date('2025-06-30'),
          creado_en: new Date(),
        },
      ], { transaction });

      // Insert sample quality objectives
      await queryInterface.bulkInsert('objetivos_calidad', [
        {
          id: uuidv4(),
          codigo: 'OC-2024-001',
          descripcion: 'Incrementar la satisfacción del cliente al 90% para diciembre 2024',
          area_id: areasId.calidad,
          responsable_id: adminUserId,
          meta: 'Satisfacción del cliente al 90%',
          valor_meta: 90.00,
          periodo_inicio: new Date('2025-01-01'),
          periodo_fin: new Date('2025-12-31'),
          estado: 'planificado',
          creado_en: new Date(),
        },
        {
          id: uuidv4(),
          codigo: 'OC-2024-002',
          descripcion: 'Reducir el tiempo de respuesta al cliente en un 20%',
          area_id: areasId.comercial,
          responsable_id: adminUserId,
          meta: 'Reducción del 20% en tiempo de respuesta',
          valor_meta: 20.00,
          periodo_inicio: new Date('2025-01-01'),
          periodo_fin: new Date('2025-12-31'),
          estado: 'planificado',
          creado_en: new Date(),
        },
        {
          id: uuidv4(),
          codigo: 'OC-2024-003',
          descripcion: 'Implementar programa de desarrollo de competencias para el 100% del personal',
          area_id: areasId.rrhh,
          responsable_id: adminUserId,
          meta: 'Capacitación del 100% del personal',
          valor_meta: 100.00,
          periodo_inicio: new Date('2025-01-01'),
          periodo_fin: new Date('2025-12-31'),
          estado: 'en_proceso',
          creado_en: new Date(),
        },
      ], { transaction });

      // Insert sample documents
      const documentosId = {
        manual: uuidv4(),
        procedimiento: uuidv4(),
        instructivo: uuidv4(),
      };

      await queryInterface.bulkInsert('documentos', [
        {
          id: documentosId.manual,
          nombre_archivo: 'Manual_de_Calidad_v2.0.pdf',
          ruta_almacenamiento: '/documentos/manuales/manual_calidad_v2.pdf',
          tipo_mime: 'application/pdf',
          tamaño_bytes: 1024000,
          tipo_documento: 'manual',
          codigo_documento: 'DOC-CAL-001',
          version: '2.0',
          estado: 'vigente',
          subido_por: adminUserId,
          creado_por: adminUserId,
          revisado_por: adminUserId,
          aprobado_por: adminUserId,
          fecha_aprobacion: new Date('2025-01-01'),
          proxima_revision: new Date('2026-01-01'),
          visibilidad: 'publico',
          contenido_html: '<h1>Manual de Calidad</h1><p>Manual del Sistema de Gestión de Calidad ISO 9001</p>',
          creado_en: new Date(),
        },
        {
          id: documentosId.procedimiento,
          nombre_archivo: 'Procedimiento_Control_Documentos_v1.5.pdf',
          ruta_almacenamiento: '/documentos/procedimientos/proc_control_docs_v1.5.pdf',
          tipo_mime: 'application/pdf',
          tamaño_bytes: 512000,
          tipo_documento: 'procedimiento',
          codigo_documento: 'PROC-CAL-001',
          version: '1.5',
          estado: 'vigente',
          subido_por: adminUserId,
          creado_por: adminUserId,
          revisado_por: adminUserId,
          aprobado_por: adminUserId,
          fecha_aprobacion: new Date('2025-01-01'),
          proxima_revision: new Date('2026-01-01'),
          visibilidad: 'publico',
          contenido_html: '<h1>Procedimiento de Control de Documentos</h1><p>Procedimiento para control de documentos del SGC</p>',
          creado_en: new Date(),
        },
        {
          id: documentosId.instructivo,
          nombre_archivo: 'Instructivo_Operacion_Equipos_v1.0.pdf',
          ruta_almacenamiento: '/documentos/instructivos/inst_operacion_v1.pdf',
          tipo_mime: 'application/pdf',
          tamaño_bytes: 256000,
          tipo_documento: 'instructivo',
          codigo_documento: 'INST-OPE-001',
          version: '1.0',
          estado: 'vigente',
          subido_por: adminUserId,
          creado_por: adminUserId,
          revisado_por: adminUserId,
          fecha_aprobacion: new Date('2025-01-01'),
          proxima_revision: new Date('2026-01-01'),
          visibilidad: 'privado',
          contenido_html: '<h1>Instructivo de Operación de Equipos</h1><p>Instructivo para operación segura de equipos</p>',
          creado_en: new Date(),
        },
      ], { transaction });

      // Insert document versions
      await queryInterface.bulkInsert('versiones_documento', [
        {
          id: uuidv4(),
          documento_id: documentosId.manual,
          numero_version: 1,
          cambios: 'Versión inicial del manual de calidad',
          subido_por: adminUserId,
          subido_en: new Date('2024-01-01'),
        },
        {
          id: uuidv4(),
          documento_id: documentosId.manual,
          numero_version: 2,
          cambios: 'Actualización por cambios en la norma ISO 9001:2015',
          subido_por: adminUserId,
          subido_en: new Date('2025-01-01'),
        },
        {
          id: uuidv4(),
          documento_id: documentosId.procedimiento,
          numero_version: 1,
          cambios: 'Primera versión del procedimiento',
          subido_por: adminUserId,
          subido_en: new Date('2024-06-01'),
        },
      ], { transaction });

      // Insert no conformidades
      const noConformidadesId = {
        nc1: uuidv4(),
        nc2: uuidv4(),
        nc3: uuidv4(),
      };

      await queryInterface.bulkInsert('no_conformidades', [
        {
          id: noConformidadesId.nc1,
          codigo: 'NC-2025-001',
          descripcion: 'Incumplimiento en tiempo de respuesta al cliente',
          tipo: 'interna',
          origen: 'auditoria_interna',
          gravedad: 'mayor',
          fecha_deteccion: new Date('2025-01-15'),
          fecha_limite: new Date('2025-02-15'),
          area_id: areasId.comercial,
          proceso_id: procesosId.ventaServicios,
          detectado_por: adminUserId,
          responsable_id: adminUserId,
          estado: 'abierta',
          creado_en: new Date(),
        },
        {
          id: noConformidadesId.nc2,
          codigo: 'NC-2025-002',
          descripcion: 'Falta de registros de capacitación',
          tipo: 'interna',
          origen: 'auditoria_interna',
          gravedad: 'menor',
          fecha_deteccion: new Date('2025-01-10'),
          fecha_limite: new Date('2025-02-10'),
          area_id: areasId.rrhh,
          proceso_id: procesosId.gestionRRHH,
          detectado_por: adminUserId,
          responsable_id: adminUserId,
          estado: 'en_tratamiento',
          creado_en: new Date(),
        },
        {
          id: noConformidadesId.nc3,
          codigo: 'NC-2024-050',
          descripcion: 'Documento desactualizado encontrado en producción',
          tipo: 'interna',
          origen: 'revision_proceso',
          gravedad: 'menor',
          fecha_deteccion: new Date('2024-12-01'),
          fecha_limite: new Date('2024-12-31'),
          area_id: areasId.calidad,
          proceso_id: procesosId.gestionCalidad,
          detectado_por: adminUserId,
          responsable_id: adminUserId,
          estado: 'cerrada',
          fecha_cierre: new Date('2024-12-20'),
          creado_en: new Date(),
        },
      ], { transaction });

      // Insert acciones correctivas
      await queryInterface.bulkInsert('acciones_correctivas', [
        {
          id: uuidv4(),
          no_conformidad_id: noConformidadesId.nc1,
          codigo: 'AC-2025-001',
          tipo: 'correctiva',
          descripcion: 'Implementar sistema de seguimiento de tiempos de respuesta',
          analisis_causa_raiz: 'Falta de procedimiento documentado para seguimiento',
          plan_accion: 'Crear procedimiento de seguimiento y capacitar al personal',
          responsable_id: adminUserId,
          fecha_compromiso: new Date('2025-02-01'),
          estado: 'planificada',
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
        {
          id: uuidv4(),
          no_conformidad_id: noConformidadesId.nc2,
          codigo: 'AC-2025-002',
          tipo: 'correctiva',
          descripcion: 'Actualizar registros de capacitación y crear sistema de control',
          analisis_causa_raiz: 'No se completaron formatos de asistencia',
          plan_accion: 'Implementar sistema digital de registro de capacitaciones',
          responsable_id: adminUserId,
          fecha_compromiso: new Date('2025-01-25'),
          fecha_implementacion: new Date('2025-01-20'),
          estado: 'implementada',
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
        {
          id: uuidv4(),
          no_conformidad_id: noConformidadesId.nc3,
          codigo: 'AC-2024-050',
          tipo: 'correctiva',
          descripcion: 'Retirar documentos obsoletos y redistribuir versiones actuales',
          analisis_causa_raiz: 'Falla en el control de distribución de documentos',
          plan_accion: 'Auditar todos los puntos de uso y redistribuir',
          responsable_id: adminUserId,
          fecha_compromiso: new Date('2024-12-15'),
          fecha_implementacion: new Date('2024-12-18'),
          fecha_verificacion: new Date('2024-12-20'),
          estado: 'cerrada',
          eficacia_verificada: true,
          observacion: 'Acción correctiva implementada exitosamente',
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
      ], { transaction });

      // Insert auditorias
      const auditoriasId = {
        aud1: uuidv4(),
        aud2: uuidv4(),
        aud3: uuidv4(),
      };

      await queryInterface.bulkInsert('auditorias', [
        {
          id: auditoriasId.aud1,
          codigo: 'AUD-2025-001',
          tipo: 'interna',
          objetivo: 'Verificar cumplimiento de requisitos ISO 9001:2015',
          alcance: 'Procesos de gestión de calidad y operaciones',
          norma_referencia: 'ISO 9001:2015',
          fecha_planificada: new Date('2025-02-15'),
          fecha_inicio: new Date('2025-02-15'),
          estado: 'planificada',
          auditor_lider_id: adminUserId,
          creado_por: adminUserId,
          creado_en: new Date(),
        },
        {
          id: auditoriasId.aud2,
          codigo: 'AUD-2025-002',
          tipo: 'seguimiento',
          objetivo: 'Seguimiento a no conformidades detectadas en auditoría anterior',
          alcance: 'Área comercial y RRHH',
          norma_referencia: 'ISO 9001:2015',
          fecha_planificada: new Date('2025-01-20'),
          fecha_inicio: new Date('2025-01-20'),
          estado: 'en_curso',
          auditor_lider_id: adminUserId,
          creado_por: adminUserId,
          creado_en: new Date(),
        },
        {
          id: auditoriasId.aud3,
          codigo: 'AUD-2024-012',
          tipo: 'interna',
          objetivo: 'Auditoría anual del sistema de gestión',
          alcance: 'Todos los procesos del SGC',
          norma_referencia: 'ISO 9001:2015',
          fecha_planificada: new Date('2024-12-01'),
          fecha_inicio: new Date('2024-12-01'),
          fecha_fin: new Date('2024-12-05'),
          estado: 'completada',
          auditor_lider_id: adminUserId,
          creado_por: adminUserId,
          creado_en: new Date(),
        },
      ], { transaction });

      // Insert hallazgos de auditoría
      await queryInterface.bulkInsert('hallazgos_auditoria', [
        {
          id: uuidv4(),
          auditoria_id: auditoriasId.aud3,
          tipo: 'no_conformidad',
          descripcion: 'Falta de registros de capacitación del personal',
          clausula_iso: '7.2',
          evidencia: 'Revisión de archivos de RRHH - Ausencia de registros de capacitación 2024',
          proceso_id: procesosId.gestionRRHH,
          area_id: areasId.rrhh,
          responsable_id: adminUserId,
          creado_en: new Date(),
        },
        {
          id: uuidv4(),
          auditoria_id: auditoriasId.aud2,
          tipo: 'observacion',
          descripcion: 'Se sugiere mejorar el control de tiempos de respuesta',
          clausula_iso: '8.2.1',
          evidencia: 'Análisis de tiempos de respuesta del área comercial',
          proceso_id: procesosId.ventaServicios,
          area_id: areasId.comercial,
          responsable_id: adminUserId,
          creado_en: new Date(),
        },
      ], { transaction });

      // Insert riesgos
      const riesgosId = {
        r1: uuidv4(),
        r2: uuidv4(),
      };

      await queryInterface.bulkInsert('riesgos', [
        {
          id: riesgosId.r1,
          codigo: 'R-CAL-001',
          descripcion: 'Pérdida de certificación ISO 9001',
          categoria: 'calidad',
          probabilidad: 2,
          impacto: 5,
          nivel_riesgo: 10,
          controles: 'Auditorías internas periódicas, revisión por la dirección',
          proceso_id: procesosId.gestionCalidad,
          area_id: areasId.calidad,
          responsable_id: adminUserId,
          estado: 'activo',
          fecha_identificacion: new Date('2025-01-01'),
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
        {
          id: riesgosId.r2,
          codigo: 'R-COM-001',
          descripcion: 'Disminución en satisfacción del cliente',
          categoria: 'operacional',
          probabilidad: 3,
          impacto: 4,
          nivel_riesgo: 12,
          controles: 'Encuestas de satisfacción, seguimiento de quejas y reclamos',
          proceso_id: procesosId.ventaServicios,
          area_id: areasId.comercial,
          responsable_id: adminUserId,
          estado: 'activo',
          fecha_identificacion: new Date('2025-01-01'),
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
      ], { transaction });

      // Insert controles de riesgo
      await queryInterface.bulkInsert('controles_riesgo', [
        {
          id: uuidv4(),
          riesgo_id: riesgosId.r1,
          descripcion: 'Auditorías internas periódicas',
          tipo: 'preventivo',
          frecuencia: 'trimestral',
          efectividad: 'alta',
          responsable_id: adminUserId,
          creado_en: new Date(),
        },
        {
          id: uuidv4(),
          riesgo_id: riesgosId.r2,
          descripcion: 'Encuestas de satisfacción mensuales',
          tipo: 'preventivo',
          frecuencia: 'mensual',
          efectividad: 'media',
          responsable_id: adminUserId,
          creado_en: new Date(),
        },
      ], { transaction });

      // Insert seguimiento de objetivos
      const objetivoId1 = (await queryInterface.sequelize.query(
        'SELECT id FROM objetivos_calidad LIMIT 1',
        { type: queryInterface.sequelize.QueryTypes.SELECT, transaction }
      ))[0]?.id;

      if (objetivoId1) {
        await queryInterface.bulkInsert('seguimiento_objetivos', [
          {
            id: uuidv4(),
            objetivo_id: objetivoId1,
            periodo: new Date('2025-01-31'),
            valor_alcanzado: 85.5,
            porcentaje_cumplimiento: 95.0,
            observaciones: 'Avance satisfactorio en el primer mes',
            registrado_por: adminUserId,
            creado_en: new Date(),
          },
        ], { transaction });
      }

      // Insert capacitaciones
      const capacitacionesId = {
        cap1: uuidv4(),
        cap2: uuidv4(),
      };

      await queryInterface.bulkInsert('capacitaciones', [
        {
          id: capacitacionesId.cap1,
          titulo: 'Introducción a ISO 9001:2015',
          descripcion: 'Capacitación sobre los fundamentos de la norma ISO 9001',
          tipo: 'presencial',
          instructor: 'Juan Pérez - Consultor Certificado',
          duracion_horas: 8.0,
          fecha_programada: new Date('2025-02-10'),
          fecha_realizacion: new Date('2025-02-10'),
          lugar: 'Sala de Capacitación - Sede Principal',
          responsable_id: adminUserId,
          estado: 'realizada',
          creado_en: new Date(),
        },
        {
          id: capacitacionesId.cap2,
          titulo: 'Auditorías Internas de Calidad',
          descripcion: 'Formación de auditores internos ISO 9001',
          tipo: 'presencial',
          instructor: 'María García - Auditora Líder',
          duracion_horas: 16.0,
          fecha_programada: new Date('2025-03-15'),
          lugar: 'Sala de Capacitación - Sede Principal',
          responsable_id: adminUserId,
          estado: 'programada',
          creado_en: new Date(),
        },
      ], { transaction });

      // Insert asistencia a capacitaciones
      await queryInterface.bulkInsert('asistencia_capacitaciones', [
        {
          id: uuidv4(),
          capacitacion_id: capacitacionesId.cap1,
          usuario_id: adminUserId,
          asistio: true,
          calificacion: 95.0,
          aprobado: true,
          comentarios: 'Excelente participación',
          creado_en: new Date(),
        },
      ], { transaction });

      // Insert etapas de proceso
      const etapaProcesoId = uuidv4();
      await queryInterface.bulkInsert('etapa_proceso', [
        {
          id: etapaProcesoId,
          proceso_id: procesosId.ventaServicios,
          orden: 1,
          nombre: 'Prospección de Cliente',
          horas_maximas: 48,
          permite_reapertura: false,
          creado_en: new Date(),
        },
        {
          id: uuidv4(),
          proceso_id: procesosId.ventaServicios,
          orden: 2,
          nombre: 'Elaboración de Propuesta',
          horas_maximas: 72,
          permite_reapertura: true,
          creado_en: new Date(),
        },
      ], { transaction });

      // Insert instancias de proceso
      const instanciaProcesoId = uuidv4();
      await queryInterface.bulkInsert('instancias_proceso', [
        {
          id: instanciaProcesoId,
          proceso_id: procesosId.ventaServicios,
          etapa_actual_id: etapaProcesoId,
          iniciado_por: adminUserId,
          estado: 'en_proceso',
          iniciado_en: new Date(),
          datos_dinamicos: JSON.stringify({ cliente: 'ABC Corp', valor_estimado: 50000 }),
          bloqueado: false,
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
      ], { transaction });

      // Insert participantes de proceso
      await queryInterface.bulkInsert('participante_procesos', [
        {
          id: uuidv4(),
          instancia_id: instanciaProcesoId,
          usuario_id: adminUserId,
          rol: 'ejecutor',
          creado_en: new Date(),
        },
      ], { transaction });

      // Insert documento_proceso
      await queryInterface.bulkInsert('documento_proceso', [
        {
          id: uuidv4(),
          instancia_id: instanciaProcesoId,
          documento_id: documentosId.procedimiento,
          nota: 'Documento de referencia para este proceso',
          adjuntado_en: new Date(),
        },
      ], { transaction });

      // Insert acciones de proceso
      await queryInterface.bulkInsert('acciones_proceso', [
        {
          id: uuidv4(),
          instancia_id: instanciaProcesoId,
          etapa_id: etapaProcesoId,
          ejecutado_por: 'admin',
          tipo_accion: 'inicio_etapa',
          comentario: 'Se inició el proceso de venta',
          ejecutado_en: new Date(),
          tiempo_respuesta_segundos: 60,
        },
      ], { transaction });

      // Insert notificaciones
      await queryInterface.bulkInsert('notificaciones', [
        {
          id: uuidv4(),
          usuario_id: adminUserId,
          mensaje: 'Bienvenido al Sistema de Gestión de Calidad - Tu cuenta ha sido creada exitosamente',
          datos: JSON.stringify({ tipo: 'sistema', titulo: 'Bienvenido al Sistema de Gestión de Calidad' }),
          leida: false,
          creado_en: new Date(),
        },
        {
          id: uuidv4(),
          usuario_id: adminUserId,
          mensaje: 'Nueva acción correctiva asignada - Se te ha asignado la acción correctiva AC-2025-001',
          datos: JSON.stringify({ tipo: 'tarea', titulo: 'Nueva acción correctiva asignada' }),
          leida: false,
          creado_en: new Date(),
        },
      ], { transaction });

      // Insert campos de formulario
      const campoFormularioId = uuidv4();
      await queryInterface.bulkInsert('campos_formulario', [
        {
          id: campoFormularioId,
          proceso_id: procesosId.ventaServicios,
          etiqueta: 'Nombre del Cliente',
          clave_campo: 'nombre_cliente',
          tipo_campo: 'text',
          requerido: true,
          orden: 1,
          opciones: null,
        },
        {
          id: uuidv4(),
          proceso_id: procesosId.ventaServicios,
          etiqueta: 'Email de Contacto',
          clave_campo: 'contacto_email',
          tipo_campo: 'email',
          requerido: true,
          orden: 2,
          opciones: null,
        },
      ], { transaction });

      // Insert respuestas de formulario
      await queryInterface.bulkInsert('respuestas_formulario', [
        {
          id: uuidv4(),
          instancia_id: instanciaProcesoId,
          campo_id: campoFormularioId,
          valor: 'ABC Corporation',
          creado_en: new Date(),
        },
      ], { transaction });

      // Insert tickets
      await queryInterface.bulkInsert('tickets', [
        {
          id: uuidv4(),
          instancia_id: instanciaProcesoId,
          creado_por: adminUserId,
          asignado_a: adminUserId,
          estado: 'abierto',
          descripcion: 'Necesito acceso a los procedimientos de calidad',
          comentario: 'Solicitud de acceso a documentos',
          creado_en: new Date(),
          resuelto_en: null,
        },
      ], { transaction });

      // Insert asignaciones
      await queryInterface.bulkInsert('asignaciones', [
        {
          id: uuidv4(),
          area_id: areasId.calidad,
          usuario_id: adminUserId,
          es_principal: true,
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
      ], { transaction });

      await transaction.commit();
      console.log('✅ Initial data seeded successfully with all tables populated');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error seeding initial data:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Delete in reverse order to handle foreign key constraints
      await queryInterface.bulkDelete('respuestas_formulario', null, { transaction });
      await queryInterface.bulkDelete('campos_formulario', null, { transaction });
      await queryInterface.bulkDelete('notificaciones', null, { transaction });
      await queryInterface.bulkDelete('acciones_proceso', null, { transaction });
      await queryInterface.bulkDelete('documento_proceso', null, { transaction });
      await queryInterface.bulkDelete('participante_procesos', null, { transaction });
      await queryInterface.bulkDelete('instancias_proceso', null, { transaction });
      await queryInterface.bulkDelete('etapa_proceso', null, { transaction });
      await queryInterface.bulkDelete('asistencia_capacitaciones', null, { transaction });
      await queryInterface.bulkDelete('capacitaciones', null, { transaction });
      await queryInterface.bulkDelete('seguimiento_objetivos', null, { transaction });
      await queryInterface.bulkDelete('objetivos_calidad', null, { transaction });
      await queryInterface.bulkDelete('controles_riesgo', null, { transaction });
      await queryInterface.bulkDelete('riesgos', null, { transaction });
      await queryInterface.bulkDelete('hallazgos_auditoria', null, { transaction });
      await queryInterface.bulkDelete('auditorias', null, { transaction });
      await queryInterface.bulkDelete('acciones_correctivas', null, { transaction });
      await queryInterface.bulkDelete('no_conformidades', null, { transaction });
      await queryInterface.bulkDelete('indicadores', null, { transaction });
      await queryInterface.bulkDelete('versiones_documento', null, { transaction });
      await queryInterface.bulkDelete('documentos', null, { transaction });
      await queryInterface.bulkDelete('tickets', null, { transaction });
      await queryInterface.bulkDelete('asignaciones', null, { transaction });
      await queryInterface.bulkDelete('procesos', null, { transaction });
      await queryInterface.bulkDelete('configuraciones', null, { transaction });
      await queryInterface.bulkDelete('roles_permisos', null, { transaction });
      await queryInterface.bulkDelete('usuarios_roles', null, { transaction });
      await queryInterface.bulkDelete('usuarios', null, { transaction });
      await queryInterface.bulkDelete('permisos', null, { transaction });
      await queryInterface.bulkDelete('roles', null, { transaction });
      await queryInterface.bulkDelete('areas', null, { transaction });

      await transaction.commit();
      console.log('✅ Initial data removed successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error removing initial data:', error);
      throw error;
    }
  }
};
