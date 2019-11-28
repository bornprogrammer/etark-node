import { sequelize } from '@app/config/Sequelize';
import ErrorFactory from '@app/errors/ErrorFactory';
import { TokenNotSentError } from '@app/errors/TokenNotSentError';
import { Sequelize } from 'sequelize';
import { userSessionRepository } from '../User/UserSessionRepository';

export class WalletModel {
    private sequelizeCon: Sequelize;
    constructor() {
        this.sequelizeCon = sequelize;
    }

    public updateWalletAmount = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            const query = `update users set wallet_amount=${params.bal} where id=${params.userId};`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public deductOrAddWalletBalance = async (params) => {
        try {
            const query = `INSERT into wallet_transactions(user_id,txn_amount,txn_type,source,source_id,created_at,updated_at) VALUES(${params.user_id},${params.amount},'${params.txn_type}','${params.source}','${params.source_id}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getWalletBalance = async (userId) => {
        try {
            const query = `SELECT CAST(SUM(IF(txn_type = 'CREDIT', txn_amount, 0)) AS SIGNED) AS credit_amount,
            CAST(SUM(IF(txn_type = 'DEBIT', txn_amount, 0)) AS SIGNED) AS debit_amount, 
            CAST(SUM(IF(txn_type = 'PROMOTIONS_CREDIT' OR txn_type = 'PROMOTIONS_RETURNED', txn_amount, 0)) AS SIGNED) AS promotions_credit_amount, 
            CAST(SUM(IF(txn_type = 'PROMOTIONS_DEBIT', txn_amount, 0)) AS SIGNED) AS promotions_debit_amount FROM wallet_transactions WHERE 
            user_id = ${userId}`;
            const result = await this.sequelizeCon.query(query);
            return result[0][0];
        } catch (error) {
            throw error;
        }
    }

    public getWalletInfo = async (params) => {
        try {
            const query = `select * from wallet_transactions where source='${params.source}' and source_id=${params.orderId} and user_id=${params.user_id};`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            throw error;
        }
    }
}

export const walletModelIns = new WalletModel();
