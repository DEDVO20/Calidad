const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const password = await bcrypt.hash('Test123!', 10);

        // 1. Crear roles si no existen
        const roles = [
            {
                id: uuidv4(),
                nombre: 'Creador de Documentos',
                clave: 'creador',
                descripcion: 'Puede crear y editar documentos en estado borrador',
                creado_en: new Date(),
            },
            {
                id: uuidv4(),
                nombre: 'Revisor de Documentos',
                clave: 'revisor',
                descripcion: 'Puede revisar documentos y cambiarlos a estado en revisión',
                creado_en: new Date(),
            },
            {
                id: uuidv4(),
                nombre: 'Aprobador de Documentos',
                clave: 'aprobador',
                descripcion: 'Puede aprobar documentos y publicarlos',
                creado_en: new Date(),
            },
        ];

        await queryInterface.bulkInsert('roles', roles, {
            ignoreDuplicates: true,
        });

        // 2. Obtener IDs de roles creados
        const [rolesData] = await queryInterface.sequelize.query(
            `SELECT id, clave FROM roles WHERE clave IN ('creador', 'revisor', 'aprobador')`
        );

        const rolesMap = rolesData.reduce((acc, rol) => {
            acc[rol.clave] = rol.id;
            return acc;
        }, {});

        // 3. Crear usuarios
        const usuarios = [
            {
                id: uuidv4(),
                documento: 1001,
                nombre: 'Juan',
                primer_apellido: 'Pérez',
                correo_electronico: 'juan.perez@ejemplo.com',
                nombre_usuario: 'juan.perez',
                contrasena_hash: password,
                activo: true,
                creado_en: new Date(),
                actualizado_en: new Date(),
            },
            {
                id: uuidv4(),
                documento: 1002,
                nombre: 'María',
                primer_apellido: 'García',
                correo_electronico: 'maria.garcia@ejemplo.com',
                nombre_usuario: 'maria.garcia',
                contrasena_hash: password,
                activo: true,
                creado_en: new Date(),
                actualizado_en: new Date(),
            },
            {
                id: uuidv4(),
                documento: 1003,
                nombre: 'Carlos',
                primer_apellido: 'López',
                correo_electronico: 'carlos.lopez@ejemplo.com',
                nombre_usuario: 'carlos.lopez',
                contrasena_hash: password,
                activo: true,
                creado_en: new Date(),
                actualizado_en: new Date(),
            },
            {
                id: uuidv4(),
                documento: 1004,
                nombre: 'Ana',
                primer_apellido: 'Martínez',
                correo_electronico: 'ana.martinez@ejemplo.com',
                nombre_usuario: 'ana.martinez',
                contrasena_hash: password,
                activo: true,
                creado_en: new Date(),
                actualizado_en: new Date(),
            },
            {
                id: uuidv4(),
                documento: 1005,
                nombre: 'Luis',
                primer_apellido: 'Rodríguez',
                correo_electronico: 'luis.rodriguez@ejemplo.com',
                nombre_usuario: 'luis.rodriguez',
                contrasena_hash: password,
                activo: true,
                creado_en: new Date(),
                actualizado_en: new Date(),
            },
        ];

        await queryInterface.bulkInsert('usuarios', usuarios, {
            ignoreDuplicates: true,
        });

        // 4. Obtener IDs de usuarios creados
        const [usuariosData] = await queryInterface.sequelize.query(
            `SELECT id, nombre_usuario FROM usuarios WHERE nombre_usuario IN ('juan.perez', 'maria.garcia', 'carlos.lopez', 'ana.martinez', 'luis.rodriguez')`
        );

        const usuariosMap = usuariosData.reduce((acc, user) => {
            acc[user.nombre_usuario] = user.id;
            return acc;
        }, {});

        // 5. Asignar roles a usuarios
        const usuarioRoles = [
            // Juan Pérez - Creador
            {
                id: uuidv4(),
                usuario_id: usuariosMap['juan.perez'],
                rol_id: rolesMap['creador'],
                asignado_en: new Date(),
            },
            // María García - Creador y Revisor
            {
                id: uuidv4(),
                usuario_id: usuariosMap['maria.garcia'],
                rol_id: rolesMap['creador'],
                asignado_en: new Date(),
            },
            {
                id: uuidv4(),
                usuario_id: usuariosMap['maria.garcia'],
                rol_id: rolesMap['revisor'],
                asignado_en: new Date(),
            },
            // Carlos López - Revisor
            {
                id: uuidv4(),
                usuario_id: usuariosMap['carlos.lopez'],
                rol_id: rolesMap['revisor'],
                asignado_en: new Date(),
            },
            // Ana Martínez - Aprobador
            {
                id: uuidv4(),
                usuario_id: usuariosMap['ana.martinez'],
                rol_id: rolesMap['aprobador'],
                asignado_en: new Date(),
            },
            // Luis Rodríguez - Todos los roles (Admin de documentos)
            {
                id: uuidv4(),
                usuario_id: usuariosMap['luis.rodriguez'],
                rol_id: rolesMap['creador'],
                asignado_en: new Date(),
            },
            {
                id: uuidv4(),
                usuario_id: usuariosMap['luis.rodriguez'],
                rol_id: rolesMap['revisor'],
                asignado_en: new Date(),
            },
            {
                id: uuidv4(),
                usuario_id: usuariosMap['luis.rodriguez'],
                rol_id: rolesMap['aprobador'],
                asignado_en: new Date(),
            },
        ];

        await queryInterface.bulkInsert('usuario_roles', usuarioRoles, {
            ignoreDuplicates: true,
        });

        console.log('\n✅ Usuarios de prueba creados exitosamente:\n');
        console.log('📋 Usuarios y Roles:');
        console.log('1. Juan Pérez (juan.perez) - Creador');
        console.log('2. María García (maria.garcia) - Creador, Revisor');
        console.log('3. Carlos López (carlos.lopez) - Revisor');
        console.log('4. Ana Martínez (ana.martinez) - Aprobador');
        console.log('5. Luis Rodríguez (luis.rodriguez) - Creador, Revisor, Aprobador');
        console.log('\n🔐 Contraseña para todos: Test123!\n');
    },

    async down(queryInterface, Sequelize) {
        // Eliminar usuarios de prueba
        await queryInterface.bulkDelete('usuario_roles', {
            usuario_id: {
                [Sequelize.Op.in]: queryInterface.sequelize.literal(
                    `(SELECT id FROM usuarios WHERE documento IN (1001, 1002, 1003, 1004, 1005))`
                ),
            },
        });

        await queryInterface.bulkDelete('usuarios', {
            documento: { [Sequelize.Op.in]: [1001, 1002, 1003, 1004, 1005] },
        });

        await queryInterface.bulkDelete('roles', {
            clave: { [Sequelize.Op.in]: ['creador', 'revisor', 'aprobador'] },
        });

        console.log('✅ Usuarios y roles de prueba eliminados');
    },
};
