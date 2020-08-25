import BaseService from "@app/services/BaseService";
import { ServiceCenterOrderTypeEnum } from "@app/enums/ServiceCenterOrderTypeEnum";
import { ServiceCenterActivityTypeEnum } from "@app/enums/ServiceCenterActivityTypeEnum";



export class ServiceCenterService extends BaseService {
    /**
     *
     */
    constructor() {
        super();
    }

    public getServiceCenterActivityTypeByOrderType = async (orderType: string): Promise<string[]> => {
        let activityTypes: string[] = [];
        switch (orderType) {
            case ServiceCenterOrderTypeEnum.ORDER_TYPE_ACCEPTED:
                activityTypes = [ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ORDER_ACCEPTED];
                break;
            case ServiceCenterOrderTypeEnum.ORDER_TYPE_IN_PROCESS:
                activityTypes = [ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_READY_TO_DISPATCH, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_TO_CONFIRM, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_MADE_PAYMENT, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_DECLINED_PAYMENT];
                break;
            case ServiceCenterOrderTypeEnum.ORDER_TYPE_DECLINED:
                activityTypes = [ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_TO_CONFIRM];
                break;
            case ServiceCenterOrderTypeEnum.ORDER_TYPE_COMPLETED:
                activityTypes = [ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_DISPATCHED];
                break;
            default: // order type allocated
                activityTypes = [ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ALLOCATED];
                break;
        }
        return activityTypes;
    }
}

export const serviceCenterServiceIns = new ServiceCenterService();