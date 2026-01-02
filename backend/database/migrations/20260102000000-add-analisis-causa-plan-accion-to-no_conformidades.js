"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("no_conformidades", "analisis_causa", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("no_conformidades", "plan_accion", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("no_conformidades", "plan_accion");
    await queryInterface.removeColumn("no_conformidades", "analisis_causa");
  },
};
