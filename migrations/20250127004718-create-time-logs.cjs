// migrations/20231010123457-create-time-logs.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("time_logs", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      task_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Tasks", // References the tasks table
          key: "id",
        },
        onDelete: "CASCADE", // Delete time logs if the referenced task is deleted
      },

      subtask_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "subtasks", // References the tasks table
          key: "id",
        },
        onDelete: "CASCADE", // Delete time logs if the referenced task is deleted
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // References the users table
          key: "id",
        },
        onDelete: "CASCADE", // Delete time logs if the referenced user is deleted
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      duration: {
        type: Sequelize.TEXT, // Duration in minutes
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("time_logs");
  },
};
