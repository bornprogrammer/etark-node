'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("user_bank_accounts", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          referenceKey: "id",
          onUpdate: "NO ACTION",
          onDelete: "NO ACTION"
        },
      },
      account_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ifsc: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      account_holder_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      validation_status: {
        type: Sequelize.INTEGER,
        default: 0,
        allowNull: false,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("user_bank_accounts");
  }
};
