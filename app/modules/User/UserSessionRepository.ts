
import UserSessionModel from './UserSessionModel';

export default class UserSessionRepository {

    public findOneByToken(token: string) {
        return UserSessionModel.findOne({
            where: {
                token,
            },
            attributes: ['userId'],
            raw: true,
        });
    }
}

export const userSessionRepository = new UserSessionRepository();
