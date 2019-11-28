import { sequelize } from '@app/config/Sequelize';
import ICashfreeApiLog from '@app/interfaces/models/ICashfreeApiLog';
import * as Sequelize from 'sequelize';

interface ICashfreeApiLogInstance extends
    Sequelize.Instance<ICashfreeApiLog>, ICashfreeApiLog {}

const CashfreeApiLog = sequelize
    .define<ICashfreeApiLogInstance, ICashfreeApiLog>(
    'CashfreeApiLog',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        request: {
            type: Sequelize.TEXT,
        },
        response: {
            type: Sequelize.TEXT,
        },
        data: {
            type: Sequelize.JSON,
        },
    },
    {
        tableName: 'cashfree_api_logs',
        underscored: true,
        timestamps: true,
    },
);

export default CashfreeApiLog;
