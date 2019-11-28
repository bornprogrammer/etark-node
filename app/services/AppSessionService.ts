import { Request } from 'express';

/**
 * would be used to store the session data throught the api call life cycle
 */
export default class AppSessionService {

    public static setUserId(req: Request, userId: number) {
        // tslint:disable-next-line: no-string-literal
        if ('user_session_data' in req === false) {
            // tslint:disable-next-line: no-string-literal
            req['user_session_data'] = {};
        }
        // tslint:disable-next-line: no-string-literal
        req['user_session_data']['user_id'] = userId;
    }

    public static getUserId(req: Request) {
        // tslint:disable-next-line: no-string-literal
        return req['user_session_data']['user_id'];
    }

    public static setUserSessionData(req: Request, userSessionData: object) {
        // tslint:disable-next-line: no-string-literal
        req['user_session_data']['user_data'] = userSessionData;
    }

    public static getUserSessionData(req: Request) {
        // tslint:disable-next-line: no-string-literal
        return req['user_session_data']['user_data'];
    }
}
