"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add 'assigned_to' column
    await queryInterface.addColumn("Tasks", "assigned_to", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "user_team", // Name of the table to reference
        key: "id", // Referencing the primary key
      },
      onDelete: "SET NULL", // Handle what happens on deletion of referenced row
    });

    // Add 'project_id' column
    await queryInterface.addColumn("Tasks", "project_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "projects", // Name of the table to reference
        key: "id", // Referencing the primary key
      },
      onDelete: "CASCADE", // Handle what happens on deletion of referenced row
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove 'assigned_to' column
    await queryInterface.removeColumn("Tasks", "assigned_to");

    // Remove 'project_id' column
    await queryInterface.removeColumn("Tasks", "project_id");
  },
};
