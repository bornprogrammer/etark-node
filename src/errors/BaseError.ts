import { HttpResponseCode } from '@app/enums/HttpResponseCodes';

export default abstract class BaseError extends Error {

    constructor(name: string, message: string) {
        super(message);
    }
}
