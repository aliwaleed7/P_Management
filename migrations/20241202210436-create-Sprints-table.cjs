  // migrations/xxxx-create-sprint.js
  module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable("sprints", {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        goal: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        start_date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        end_date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        project_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "projects",
            key: "id",
          },
          allowNull: false,
        },
        workspace_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "Workspaces",
            key: "id",
          },
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });
    },
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable("sprints");
    },
  };
