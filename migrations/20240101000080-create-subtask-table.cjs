// migrations/xxxx-create-subtasks.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("subtasks", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      task_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Tasks", // The referenced table
          key: "id", // The primary key of the referenced table
        },
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      assigned_to: {
        type: Sequelize.INTEGER,
        references: {
          model: "user_team_workspaces", // The referenced table
          key: "id", // The primary key of the referenced table
        },
        allowNull: true,
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      priority: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("subtasks");
  },
};
