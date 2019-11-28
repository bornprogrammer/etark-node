import ErrorFactory from '@app/errors/ErrorFactory';
import { TokenNotFoundError } from '@app/errors/TokenNotFoundError';
import { TokenNotSentError } from '@app/errors/TokenNotSentError';
import { userSessionRepository } from './UserSessionRepository';
import UserSessionRepository from './UserSessionRepository';

export default class UserSessionService {

    constructor(private userSessionRepository: UserSessionRepository) {
        this.userSessionRepository = userSessionRepository;
    }

    public checkToken = async (token: any) => {
        let userSession: any;
        if (token) {
            try {
                userSession = (await this.userSessionRepository.findOneByToken(token));
                console.log('[USERID]', userSession);

                if ((userSession === null) || (userSession === undefined)) {
                    throw new TokenNotFoundError();
                }
                return userSession.userId;
            } catch (error) {
                console.log('EROOR', error);
                throw new ErrorFactory(error);
            }
        } else {
            console.log('here');
            throw new TokenNotSentError();
        }
    }
}

export const userSessionService = new UserSessionService(userSessionRepository);
