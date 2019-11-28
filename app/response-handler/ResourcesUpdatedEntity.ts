import { ResponseCodesEnum } from '../enums/ResponseCodesEnum';
import ResponseEntity from './ResponseEntity';

export default class ResourcesUpdatedEntity extends ResponseEntity {
    public data: any;

    constructor(data: any, message: string) {
        super(true, message, ResponseCodesEnum.RESOURCES_CREATED);
        this.data = data;
    }
}
