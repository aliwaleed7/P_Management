// migrations/xxxx-create-space.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("spaces", {
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
      workspace_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Workspaces", // The referenced table
          key: "id", // The primary key of the referenced table
        },
        allowNull: false,
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users", // The referenced table
          key: "id", // The primary key of the referenced table
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
    await queryInterface.dropTable("spaces");
  },
};
