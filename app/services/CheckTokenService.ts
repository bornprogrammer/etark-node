
import UserRepositoryService from '@app/modules/User/UserSessionRepository';

export default class CheckTokenService {

    public isTokenValid(token: string, isBuddy: boolean) {
// tslint:disable-next-line: no-console
        console.log('authenticated');
        return true;
    }

}
