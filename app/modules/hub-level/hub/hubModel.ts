import { sequelize } from '@app/config/Sequelize';
import { TokenNotSentError } from '@app/errors/TokenNotSentError';
import { Sequelize } from 'sequelize';

export class HubModel {
    private sequelizeCon: Sequelize;
    constructor() {
        this.sequelizeCon = sequelize;
    }

    public deleteUserAddedSecondaryHub = async (data: any) => {
        try {
            const sql = `SELECT name,pin_code from localities
            where pin_code like "${data.searchKey}%" or name like "%${data.searchKey}%"
            limit 20 offset ${data.offset}`;
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new TokenNotSentError();
        }
    }
}

export const hubModelIns = new HubModel();
