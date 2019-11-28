'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("cashfree_batch_payouts", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      batch_transfer_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reference_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      total_transactions_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      successfull_transactions_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      failed_transactions_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      cron_job_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "buddy_payout_cron_jobs",
          referenceKey: "id",
          onUpdate: "NO ACTION",
          onDelete: "NO ACTION"
        },
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("cashfree_batch_payouts");
  }
};
