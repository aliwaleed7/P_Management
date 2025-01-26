// migrations/xxxx-create-folder.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("folders", {
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
      space_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "spaces", // The referenced table
          key: "id", // The primary key of the referenced table
        },
        allowNull: true, // This can be null, meaning the folder may not be associated with a space
      },
      parent_folder_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "folders", // The referenced table (same table for hierarchical structure)
          key: "id", // The primary key of the referenced table
        },
        allowNull: true, // This can be null, meaning the folder may not be a subfolder
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
    await queryInterface.dropTable("folders");
  },
};
