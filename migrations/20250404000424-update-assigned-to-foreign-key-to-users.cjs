"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First remove the old foreign key constraint
    await queryInterface.removeConstraint("Tasks", "Tasks_assigned_to_fkey");

    // Then add the new foreign key referencing Users
    await queryInterface.addConstraint("Tasks", {
      fields: ["assigned_to"],
      type: "foreign key",
      name: "Tasks_assigned_to_fkey", // You can rename it if you'd like
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert back to the original reference (user_team_workspaces)
    await queryInterface.removeConstraint("Tasks", "Tasks_assigned_to_fkey");

    await queryInterface.addConstraint("Tasks", {
      fields: ["assigned_to"],
      type: "foreign key",
      name: "Tasks_assigned_to_fkey",
      references: {
        table: "user_team_workspaces",
        field: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  },
};
