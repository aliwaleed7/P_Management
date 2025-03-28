module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("dashboards", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      dash_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      list_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "lists", // Reference to lists table
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        allowNull: true,
      },
      ws_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // Ensuring it's NOT NULL
        references: {
          model: "Workspaces", // Reference to workspace table
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT", // Prevent deletion if referenced
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"), // Fix: Use NOW() instead
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"), // Fix: Remove "ON UPDATE CURRENT_TIMESTAMP"
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("dashboards");
  },
};
