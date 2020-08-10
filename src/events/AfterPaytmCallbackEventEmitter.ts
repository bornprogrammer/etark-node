import { BaseEventEmitter } from "./BaseEventEmitter";
import { EventEmitterIdentifierEnum } from "@app/enums/EventEmitterIdentifierEnum";
import { PaytmCallbackResponseEntity } from "@app/entities/PaytmCallbackResponseEntity";
import { userPlanServiceIns } from "@app/features/user-plan/UserPlanService";
import { userPlanRepositoryServiceIns } from "@app/features/user-plan/UserPlanRepositoryService";
import { fileReaderServiceIns } from "@app/services/FileReaderService";
import { nodeMailerServiceIns } from "@app/services/NodeMailerService";
import { UtilsHelper } from "@app/helpers/UtilsHelper";

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
        if (this.isPaymentSucces(paytmResp)) {
            // let result = this.get
            let result = await userPlanRepositoryServiceIns.getDetailsForOrderEmailTemp(userPlanServiceIns.removeOrderPrefixFromOrderNo(paytmResp.ORDERID));
            if (result) {
                fileReaderServiceIns.readEmailTemplate("order-detail.html", this.sendOrderEmail.bind(null, result));
            }
        }
    }

    public sendOrderEmail = (orderDetail, error, data) => {
        let orderDetailObj = orderDetail[0];
        nodeMailerServiceIns.sendHtml("service@etark.in", orderDetailObj.email, "Order email", UtilsHelper.replaceAllStr(orderDetailObj, data));
    }

    public isPaymentSucces = (paytmResp: any): boolean => {
        return paytmResp.STATUS === "TXN_SUCCESS";
    }
}

export const afterPaytmCallbackEventEmitterIns = new AfterPaytmCallbackEventEmitter();