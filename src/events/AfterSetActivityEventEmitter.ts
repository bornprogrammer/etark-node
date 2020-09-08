import { BaseQueue } from "./BaseQueue";
import { EventEmitterIdentifierEnum } from "@app/enums/EventEmitterIdentifierEnum";
import { userPlanRepositoryServiceIns } from "@app/features/user-plan/UserPlanRepositoryService";
import { ServiceCenterActivityTypeEnum } from "@app/enums/ServiceCenterActivityTypeEnum";
import { userRepositoryServiceIns } from "@app/features/users/UserRepositoryService";


export class AfterSetActivityEventEmitter extends BaseQueue {


    /**
     *
     */
    constructor() {
        super(EventEmitterIdentifierEnum.AFTER_SET_ACTIVITY_EVENTEMITTER);
    }

    public async handleJob(data?: any) {
        let params = data;
        await this.refundInspectionFee(params);
    }

    public refundInspectionFee = async (params: any) => {
        if (params.activity_type === ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_INSPECTION_FEE_DENIED) {
            await userPlanRepositoryServiceIns.refundInspectionFee(params.pickup_delivery_id);
        } else if (params.activity_type === ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED) {
            await this.assignAnotherServiceCenter(params);
        } else if (params.activity_type === ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_READY_TO_DISPATCH) {
            this.sendFinalInvoiceEmail(params);
        }
    }

    public assignAnotherServiceCenter = async (params: any) => {
        await userRepositoryServiceIns.assignNewServiceCenter(params.pickup_delivery_id);
    }

    public sendFinalInvoiceEmail = async (params: any) => {
        // let result = 
    }
}

export const afterSetActivityEventEmitterIns = new AfterSetActivityEventEmitter();