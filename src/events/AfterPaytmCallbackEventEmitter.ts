import { BaseEventEmitter } from "./BaseEventEmitter";
import { EventEmitterIdentifierEnum } from "@app/enums/EventEmitterIdentifierEnum";
import { PaytmCallbackResponseEntity } from "@app/entities/PaytmCallbackResponseEntity";
import { userPlanRepositoryIns } from "@app/repositories/UserPlanRepository";
import { userPlanServiceIns } from "@app/features/user-plan/UserPlanService";

export class AfterPaytmCallbackEventEmitter extends BaseEventEmitter {
    /**
     *
     */
    constructor() {
        super(EventEmitterIdentifierEnum.AFTER_PAYTM_CALLBACK_EVENTEMITTER);
    }

    public handle(data?: any) {
        this.sendEmail(data);
    }

    public sendEmail = async (data: any) => {
        let paytmResp: PaytmCallbackResponseEntity = data;
        if (paytmResp.STATUS === "TXN_SUCCESS") {
            // let result = await userPlanRepositoryIns.getDetailsForOrderEmailTemp(userPlanServiceIns.removeOrderPrefixFromOrderNo(paytmResp.ORDERID));
            // fileReaderServiceIns.readEmailTemplate("order-detail.html", this.sendOrderEmail.bind(null, result));
        }
        // return params;
    }

    public isPaymentSucces = (paytmResp: any) => {

    }
}

export const afterPaytmCallbackEventEmitterIns = new AfterPaytmCallbackEventEmitter();