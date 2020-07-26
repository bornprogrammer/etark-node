import { HttpResponseCode } from '@app/enums/HttpResponseCodes';

import { HttpResponseError } from './HttpResponseError';

export default class UnAuthorized extends HttpResponseError {

    constructor() {
        super(HttpResponseCode.UNAUTHORIZED, "either username or password is wrong");
    }

}