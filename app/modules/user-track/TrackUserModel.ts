import { sequelize } from '@app/config/Sequelize';
import ErrorFactory from '@app/errors/ErrorFactory';
import { TokenNotSentError } from '@app/errors/TokenNotSentError';
import { Sequelize } from 'sequelize';
import { userSessionRepository } from '../User/UserSessionRepository';

export class TrackUserModel {
    private sequelizeCon: Sequelize;
    constructor() {
        this.sequelizeCon = sequelize;
    }

    public updateBannerCount = async (obj: any) => {
        try {
            // tslint:disable-next-line: radix
            const query = `insert into track_user_action(origin,origin_id,user_id,action_look_up_id)
            value(${obj.origin},${obj.originId},${obj.userId},${obj.actionId})`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

}

export const trackUserModelIns = new TrackUserModel();
