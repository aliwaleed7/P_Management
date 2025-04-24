"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Tasks", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "To Do",
      },
      priority: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "Low", // Default priority
      },
      estimatedTime: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      assigned_to: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users", // ✅ Updated reference
          key: "id",
        },
        onDelete: "SET NULL",
        allowNull: true,
      },
      dueDate: {
        type: Sequelize.DATE,
      },
      listId: {
        type: Sequelize.INTEGER,
        references: {
          model: "lists", // Updated to associate tasks with lists
          key: "id",
        },
        onDelete: "CASCADE",
        allowNull: false,
      },

      milestoneId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Timelines", // Updated to associate tasks with lists
          key: "id",
        },
        onDelete: "CASCADE",
        allowNull: true,
      },

      sprintId: {
        type: Sequelize.INTEGER,
        references: {
          model: "sprints", // Updated to associate tasks with lists
          key: "id",
        },
        onDelete: "CASCADE",
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Tasks");
  },
};
