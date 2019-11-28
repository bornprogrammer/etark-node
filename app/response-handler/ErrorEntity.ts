import { ResponseCodesEnum } from '../enums/ResponseCodesEnum';
import ResponseEntity from './ResponseEntity';

export default class ErrorEntity extends ResponseEntity {

    constructor(message: string, httpStatusCode: ResponseCodesEnum) {
        super(false, message, httpStatusCode);
    }
}
