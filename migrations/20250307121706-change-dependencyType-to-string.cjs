"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("dependencies", "dependencyType", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("dependencies", "dependencyType", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
