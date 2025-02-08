// migrations/xxxx-create-comments.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("comments", {
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
        allowNull: true, // Comment may not always belong to a task
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      subtask_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "subtasks", // The referenced table
          key: "id", // The primary key of the referenced table
        },
        allowNull: true, // Comment may not always belong to a subtask
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users", // The referenced table
          key: "id", // The primary key of the referenced table
        },
        allowNull: false, // Every comment must belong to a user
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true, // Comment text is required
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
    await queryInterface.dropTable("comments");
  },
};
