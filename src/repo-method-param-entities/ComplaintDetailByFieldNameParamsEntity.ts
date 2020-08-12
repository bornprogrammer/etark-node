import { EOPNOTSUPP } from "constants";
import { GetComplaintDetailsParamsEntity } from "./GetComplaintDetailsParamsEntity";
import { SmartphoneComplainFieldsEnum } from "@app/enums/SmartphoneComplainFieldsEnum";



export class ComplaintDetailByFieldNameParamsEntity extends GetComplaintDetailsParamsEntity {

    public fieldName: SmartphoneComplainFieldsEnum;
    /**
     *
     */
    constructor(complaintId: number, fieldName: SmartphoneComplainFieldsEnum) {
        super(complaintId);
        this.fieldName = fieldName;
    }

}