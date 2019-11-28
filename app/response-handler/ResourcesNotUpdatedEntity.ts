import { ResponseCodesEnum } from '../enums/ResponseCodesEnum';
import ResponseEntity from './ResponseEntity';

export default class ResourcesNotUpdatedEntity extends ResponseEntity {
    public data: any;

    constructor(message: string) {
        super(false, message, ResponseCodesEnum.EXCEPTION_FAILED);
    }
}
