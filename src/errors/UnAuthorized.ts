import { HttpResponseCode } from '@app/enums/HttpResponseCodes';

import { HttpResponseError } from './HttpResponseError';

export default class UnAuthorized extends HttpResponseError {

    constructor(message?: string) {
        super(HttpResponseCode.UNAUTHORIZED, message || "either username or password is wrong");
    }

}