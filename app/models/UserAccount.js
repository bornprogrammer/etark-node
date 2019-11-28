"use strict";
exports.__esModule = true;
var Sequelize_1 = require("@app/config/Sequelize");
var Sequelize = require("sequelize");
exports.UserAccount = Sequelize_1.sequelize.define('v2_user_accounts', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: { type: Sequelize.INTEGER, field: 'user_id' },
    overallEarnedAmount: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'overall_earned_amount'
    },
    incurredPkPlanCharge: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'incurred_pk_plan_charge'
    },
    incurredPkGatewayCharge: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'incurred_pk_gateway_charge'
    },
    incurredServiceCharge: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'incurred_service_charge'
    },
    incurredOverallCharge: {
        type: Sequelize.VIRTUAL,
        get: function () {
            return (Number(this.get('incurredPkPlanCharge')) +
                Number(this.get('incurredPkGatewayCharge')) +
                Number(this.get('incurredServiceCharge')));
        }
    },
    paidOverallCharge: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'paid_overall_charge'
    },
    pendingOverallCharge: {
        type: Sequelize.VIRTUAL,
        get: function () {
            return (Number(this.get('incurredOverallCharge')) -
                Number(this.get('paidOverallCharge')));
        }
    },
    savedServiceCharge: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'saved_service_charge'
    },
    onlineOrdersAmount: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'online_orders_amount'
    },
    receivedOnlineOrdersAmount: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'received_online_orders_amount'
    },
    pendingOnlineOrdersAmount: {
        type: Sequelize.VIRTUAL,
        get: function () {
            return (this.get('onlineOrdersAmount') - this.get('receivedOnlineOrdersAmount'));
        }
    },
    pkOnlineOrdersAmount: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'pk_online_orders_amount'
    },
    pkOnlineOrdersCount: {
        type: Sequelize.INTEGER,
        field: 'pk_online_orders_count'
    }
}, {
    timestamps: true,
    underscored: true
});
exports["default"] = exports.UserAccount;
