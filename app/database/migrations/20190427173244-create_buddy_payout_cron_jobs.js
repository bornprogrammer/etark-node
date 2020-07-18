'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("buddy_payout_cron_jobs", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      total_eligible_transfers: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      users_without_payment_details: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_bank_transfers: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_paytm_transfers: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      successfull_bank_transfers: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      unsuccessfull_bank_transfers: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      successfull_paytm_transfers: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      unsuccessfull_paytm_transfers: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      processed_at: Sequelize.DATE,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("buddy_payout_cron_jobs");
  }
};
