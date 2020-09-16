import BaseService from "@app/services/BaseService";
import { AppConstants } from "@app/constants/AppConstants";

export class UserPlanService extends BaseService {
    /**
     *
     */
    constructor() {
        super();
    }

    public removeOrderPrefixFromOrderNo(orderNo: string): string {
        if (orderNo) {
            let val = orderNo.split("-").pop();
            return val;
            // return orderNo.replace(AppConstants.ORDER_ID_PREFIX, "");
        }
        return null;
    }
}

export const userPlanServiceIns = new UserPlanService();