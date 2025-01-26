// migrations/xxxx-create-list.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("lists", {
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
        allowNull: true, // This can be null, meaning the list may not be associated with a space
      },
      folder_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "folders", // The referenced table
          key: "id", // The primary key of the referenced table
        },
        allowNull: true, // This can be null, meaning the list may not be associated with a folder
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
    await queryInterface.dropTable("lists");
  },
};
