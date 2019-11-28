'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("cashfree_api_logs", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      request: {
        type: Sequelize.TEXT
      },
      response: {
        type: Sequelize.TEXT
      },
      data: {
        type: Sequelize.JSON,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("cashfree_api_logs");
  }
};
