// migrations/xxxx-create-sprint-backlog.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("sprint_backlogs", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      sprint_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "sprints",
          key: "id",
        },
        allowNull: false,
      },
      backlog_item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "backlog_items",
          key: "id",
        },
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("sprint_backlogs");
  },
};
