import { ResponseCodesEnum } from '../enums/ResponseCodesEnum';
import ResponseEntity from './ResponseEntity';

export default class ResponseNotFoundEntity extends ResponseEntity {

    constructor(message: string) {
        super(false, message, ResponseCodesEnum.NOT_FOUND);
    }
}
