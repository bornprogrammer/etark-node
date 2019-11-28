import { sequelize } from '@app/config/Sequelize';
import { TokenNotSentError } from '@app/errors/TokenNotSentError';
import { Sequelize } from 'sequelize';

export class LocalityModel {
    private sequelizeCon: Sequelize;
    constructor() {
        this.sequelizeCon = sequelize;
    }

    public searchLocality = async (data: any) => {
        try {
            // console.log('i am here');
            const sql = `SELECT id,name,pin_code from localities
            where pin_code like "${data.searchKey}%" or name like "%${data.searchKey}%"
            limit 20 offset ${(data.page - 1) * 20}`;
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new TokenNotSentError();
        }
    }
}

export const localityModelIns = new LocalityModel();
