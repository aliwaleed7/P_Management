// migrations/xxxx-create-files.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("files", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      file_path: {
        type: Sequelize.STRING,
        allowNull: false, // File path is required
      },
      task_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Tasks", // The referenced table
          key: "id", // The primary key of the referenced table
        },
        allowNull: true, // File may not always belong to a task
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      subtask_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "subtasks", // The referenced table
          key: "id", // The primary key of the referenced table
        },
        allowNull: true, // File may not always belong to a subtask
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      comment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "comments", // The referenced table
          key: "id", // The primary key of the referenced table
        },
        allowNull: true, // File may not always belong to a comment
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      uploaded_by: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users", // The referenced table
          key: "id", // The primary key of the referenced table
        },
        allowNull: false, // File must always be uploaded by a user
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      uploaded_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("files");
  },
};
