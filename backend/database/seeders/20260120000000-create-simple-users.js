'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Contraseña para todos los usuarios: Test123!
        const password = await bcrypt.hash('Test123!', 10);

        // Crear usuarios de prueba
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

        console.log('\n✅ Usuarios de prueba creados exitosamente:\n');
        console.log('📋 Usuarios creados:');
        console.log('1. Juan Pérez (juan.perez)');
        console.log('2. María García (maria.garcia)');
        console.log('3. Carlos López (carlos.lopez)');
        console.log('4. Ana Martínez (ana.martinez)');
        console.log('5. Luis Rodríguez (luis.rodriguez)');
        console.log('\n🔐 Contraseña para todos: Test123!\n');
    },

    async down(queryInterface, Sequelize) {
        // Eliminar usuarios de prueba
        await queryInterface.bulkDelete('usuarios', {
            documento: { [Sequelize.Op.in]: [1001, 1002, 1003, 1004, 1005] },
        });

        console.log('✅ Usuarios de prueba eliminados\n');
    },
};