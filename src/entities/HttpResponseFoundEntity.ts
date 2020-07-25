
import HttpResponseEntity from './HttpResponseEntity';
import { HttpResponseCode } from '@app/enums/HttpResponseCodes';

export default class HttpResponseFoundEntity extends HttpResponseEntity {
    // public data: any;

    constructor(data: any, message: string) {
        super(message, HttpResponseCode.SUCCESS);
        this.result = data;
    }
}
