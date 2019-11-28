'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("buddy_payout_missing_accounts", {
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
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("buddy_payout_missing_accounts");
  }
};
