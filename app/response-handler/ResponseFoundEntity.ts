import { ResponseCodesEnum } from '../enums/ResponseCodesEnum';
import ResponseEntity from './ResponseEntity';

export default class ResponseFoundEntity extends ResponseEntity {
    public data: any;

    constructor(data: any, message: string) {
        super(true, message, ResponseCodesEnum.SUCCESS);
        this.data = data;
    }
}
