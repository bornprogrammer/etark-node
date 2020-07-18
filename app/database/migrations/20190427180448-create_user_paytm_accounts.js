'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("user_paytm_accounts", {
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
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cashfree_beneficiary_id: {
        type: Sequelize.STRING,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("user_paytm_accounts");
  }
};
