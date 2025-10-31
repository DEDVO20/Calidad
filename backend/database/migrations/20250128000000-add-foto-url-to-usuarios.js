'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'foto_url', {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: 'URL de la foto de perfil del usuario'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuarios', 'foto_url');
  }
};
