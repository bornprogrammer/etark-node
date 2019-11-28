import Logger from '@app/services/Logger';
import * as Sequelize from 'sequelize';
const database = process.env.DB_DATABASE;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;

let logSetting: any = true;
if (process.env.ENABLE_SQL_LOG === 'true') {
    logSetting = (str) => {
        Logger.debug(str);
    };
}

export const sequelize = new Sequelize.Sequelize(
    database,
    username,
    password,
    {
        host,
        dialect: process.env.DB_DIALECT,
        operatorsAliases: false,
        logging: logSetting,
        pool: {
            // tslint:disable-next-line: radix
            max: parseInt(process.env.DB_MAX_CON_POOL),
            // tslint:disable-next-line: radix
            min: parseInt(process.env.DB_MIN_CON_POOL),
            // tslint:disable-next-line: radix
            idle: parseInt(process.env.DB_IDLE_CON),
        },
    },
);
