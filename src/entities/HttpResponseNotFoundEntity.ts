
import HttpResponseEntity from './HttpResponseEntity';
import { HttpResponseCode } from '@app/enums/HttpResponseCodes';

export default class HttpResponseNotFoundEntity extends HttpResponseEntity {

    constructor(message: string) {
        super(message, HttpResponseCode.NOT_FOUND);
    }
}
