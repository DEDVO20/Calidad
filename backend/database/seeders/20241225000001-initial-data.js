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
      await queryInterface.bulkInsert('usuario_roles', [
        {
          id: uuidv4(),
          usuario_id: adminUserId,
          rol_id: rolesId.administrador,
          creado_en: new Date(),
        },
      ], { transaction });

      // Assign all permissions to admin role
      const rolPermisosAdmin = permisosConId.map(permiso => ({
        id: uuidv4(),
        rol_id: rolesId.administrador,
        permiso_id: permiso.id,
        creado_en: new Date(),
      }));

      await queryInterface.bulkInsert('rol_permisos', rolPermisosAdmin, { transaction });

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
        creado_en: new Date(),
      }));

      await queryInterface.bulkInsert('rol_permisos', rolPermisosCoordinador, { transaction });

      // User role basic permissions
      const rolPermisosUsuario = permisosBasicos.map(permiso => ({
        id: uuidv4(),
        rol_id: rolesId.usuario,
        permiso_id: permiso.id,
        creado_en: new Date(),
      }));

      await queryInterface.bulkInsert('rol_permisos', rolPermisosUsuario, { transaction });

      // Insert initial configurations
      await queryInterface.bulkInsert('configuraciones', [
        {
          id: uuidv4(),
          clave: 'EMPRESA_NOMBRE',
          valor: 'Mi Empresa SGC',
          descripcion: 'Nombre de la empresa',
          tipo_dato: 'string',
          categoria: 'general',
          activa: true,
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
        {
          id: uuidv4(),
          clave: 'EMPRESA_NIT',
          valor: '123456789-0',
          descripcion: 'NIT de la empresa',
          tipo_dato: 'string',
          categoria: 'general',
          activa: true,
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
        {
          id: uuidv4(),
          clave: 'SGC_VERSION_NORMA',
          valor: 'ISO 9001:2015',
          descripcion: 'Versión de la norma implementada',
          tipo_dato: 'string',
          categoria: 'calidad',
          activa: true,
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
        {
          id: uuidv4(),
          clave: 'NOTIFICACIONES_EMAIL',
          valor: 'true',
          descripcion: 'Habilitar notificaciones por email',
          tipo_dato: 'boolean',
          categoria: 'notificaciones',
          activa: true,
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
        {
          id: uuidv4(),
          clave: 'AUDITORIA_FRECUENCIA_DIAS',
          valor: '365',
          descripcion: 'Frecuencia de auditorías internas en días',
          tipo_dato: 'number',
          categoria: 'auditoria',
          activa: true,
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
        {
          id: uuidv4(),
          clave: 'RIESGO_MATRIZ_CRITERIOS',
          valor: '{"probabilidad": {"muy_baja": 1, "baja": 2, "media": 3, "alta": 4, "muy_alta": 5}, "impacto": {"muy_bajo": 1, "bajo": 2, "medio": 3, "alto": 4, "muy_alto": 5}}',
          descripcion: 'Criterios para evaluación de riesgos',
          tipo_dato: 'json',
          categoria: 'riesgos',
          activa: true,
          creado_en: new Date(),
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
          codigo: 'IND-CAL-001',
          nombre: 'Satisfacción del Cliente',
          descripcion: 'Porcentaje de satisfacción del cliente basado en encuestas',
          formula: '(Clientes satisfechos / Total clientes encuestados) * 100',
          unidad_medida: '%',
          meta: 85.00,
          frecuencia_medicion: 'trimestral',
          responsable_medicion_id: adminUserId,
          activo: true,
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
        {
          id: uuidv4(),
          proceso_id: procesosId.ventaServicios,
          codigo: 'IND-COM-001',
          nombre: 'Cumplimiento de Metas de Ventas',
          descripcion: 'Porcentaje de cumplimiento de las metas mensuales de ventas',
          formula: '(Ventas realizadas / Meta de ventas) * 100',
          unidad_medida: '%',
          meta: 100.00,
          frecuencia_medicion: 'mensual',
          responsable_medicion_id: adminUserId,
          activo: true,
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
        {
          id: uuidv4(),
          proceso_id: procesosId.gestionRRHH,
          codigo: 'IND-RRHH-001',
          nombre: 'Eficacia de la Capacitación',
          descripcion: 'Porcentaje de eficacia de los programas de capacitación',
          formula: '(Capacitaciones efectivas / Total capacitaciones) * 100',
          unidad_medida: '%',
          meta: 80.00,
          frecuencia_medicion: 'semestral',
          responsable_medicion_id: adminUserId,
          activo: true,
          creado_en: new Date(),
          actualizado_en: new Date(),
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
          fecha_inicio: new Date(),
          fecha_fin: new Date(new Date().getFullYear(), 11, 31), // December 31st
          estado: 'planificado',
          progreso: 0.00,
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
        {
          id: uuidv4(),
          codigo: 'OC-2024-002',
          descripcion: 'Reducir el tiempo de respuesta al cliente en un 20%',
          area_id: areasId.comercial,
          responsable_id: adminUserId,
          fecha_inicio: new Date(),
          fecha_fin: new Date(new Date().getFullYear(), 11, 31),
          estado: 'planificado',
          progreso: 0.00,
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
        {
          id: uuidv4(),
          codigo: 'OC-2024-003',
          descripcion: 'Implementar programa de desarrollo de competencias para el 100% del personal',
          area_id: areasId.rrhh,
          responsable_id: adminUserId,
          fecha_inicio: new Date(),
          fecha_fin: new Date(new Date().getFullYear(), 11, 31),
          estado: 'en_proceso',
          progreso: 25.00,
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
      ], { transaction });

      await transaction.commit();
      console.log('✅ Initial data seeded successfully');
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
      await queryInterface.bulkDelete('seguimiento_objetivos', null, { transaction });
      await queryInterface.bulkDelete('objetivos_calidad', null, { transaction });
      await queryInterface.bulkDelete('indicadores', null, { transaction });
      await queryInterface.bulkDelete('procesos', null, { transaction });
      await queryInterface.bulkDelete('configuraciones', null, { transaction });
      await queryInterface.bulkDelete('rol_permisos', null, { transaction });
      await queryInterface.bulkDelete('usuario_roles', null, { transaction });
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
