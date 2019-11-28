'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("v2_user_accounts", {
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
        },
        unique: true,
      },
      overall_earned_amount: {
        type: Sequelize.DECIMAL(9,2),
        allowNull: false,
        defaultValue: 0.00,
      },
      incurred_pk_plan_charge: {
        type: Sequelize.DECIMAL(9,2),
        allowNull: false,
        defaultValue: 0.00,
      },
      incurred_pk_gateway_charge: {
        type: Sequelize.DECIMAL(9,2),
        allowNull: false,
        defaultValue: 0.00,
      },
      incurred_service_charge: {
        type: Sequelize.DECIMAL(9,2),
        allowNull: false,
        defaultValue: 0.00,
      },
      paid_overall_charge: {
        type: Sequelize.DECIMAL(9,2),
        allowNull: false,
        defaultValue: 0.00,
      },
      saved_service_charge: {
        type: Sequelize.DECIMAL(9,2),
        allowNull: false,
        defaultValue: 0.00,
      },
      online_orders_amount: {
        type: Sequelize.DECIMAL(9,2),
        allowNull: false,
        defaultValue: 0.00,
      },
      received_online_orders_amount: {
        type: Sequelize.DECIMAL(9,2),
        allowNull: false,
        defaultValue: 0.00,
      },
      pk_online_orders_amount: {
        type: Sequelize.DECIMAL(9,2),
        allowNull: false,
        defaultValue: 0.00,
      },
      pk_online_orders_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      pk_plans: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: '[]',
      },
      paid_overall_by_credits: {
        type: Sequelize.DECIMAL(9,2),
        allowNull: false,
        defaultValue: 0.00,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("v2_user_accounts");
  }
};
