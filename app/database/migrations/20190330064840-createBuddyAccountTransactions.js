'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("buddy_account_transactions", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          referenceKey: "id",
          onUpdate: "CASCADE",
          onDelete: "NO ACTION"
        }
      },
      credit: Sequelize.DECIMAL(10,2),
      debit: Sequelize.DECIMAL(10,2),
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("buddy_account_transactions");
  }
};
