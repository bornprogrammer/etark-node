'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("cashfree_buddy_payouts", {
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
      bank_account_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user_bank_accounts",
          referenceKey: "id",
          onUpdate: "NO ACTION",
          onDelete: "NO ACTION"
        },
      },
      paytm_account_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user_paytm_accounts",
          referenceKey: "id",
          onUpdate: "NO ACTION",
          onDelete: "NO ACTION"
        },
      },
      credit: {
        type: Sequelize.DECIMAL(9,2),
        allowNull: false,
      },
      debit: {
        type: Sequelize.DECIMAL(9,2),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(9,2),
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      cashfree_transfer_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      cashfree_reference_id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: true,
      },
      failure_reason: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      buddy_account_transaction_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "buddy_account_transactions",
          referenceKey: "id",
          onUpdate: "NO ACTION",
          onDelete: "NO ACTION"
        },
      },
      account_transaction_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "account_transaction",
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
      cashfree_batch_payout_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "cashfree_batch_payouts",
          referenceKey: "id",
          onUpdate: "NO ACTION",
          onDelete: "NO ACTION"
        },
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("cashfree_buddy_payouts");
  }
};
