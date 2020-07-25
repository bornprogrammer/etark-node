
import HttpResponseEntity from './HttpResponseEntity';
import { HttpResponseCode } from '@app/enums/HttpResponseCodes';

export default class HttpResourcesNotUpdatedEntity extends HttpResponseEntity {

    // public data: any;

    constructor(message: string) {
        super(message, HttpResponseCode.EXCEPTION_FAILED);
    }
}
