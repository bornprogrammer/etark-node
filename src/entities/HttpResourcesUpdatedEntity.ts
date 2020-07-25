
import HttpResponseEntity from './HttpResponseEntity';
import { HttpResponseCode } from '@app/enums/HttpResponseCodes';

export default class HttpResourcesUpdatedEntity extends HttpResponseEntity {

    // public data: any;

    constructor(data: any, message: string) {
        super(message, HttpResponseCode.RESOURCES_CREATED);
        this.result = data;
    }
}
