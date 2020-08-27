import BaseService from "@app/services/BaseService";
import { ServiceCenterOrderTypeEnum } from "@app/enums/ServiceCenterOrderTypeEnum";
import { ServiceCenterActivityTypeEnum } from "@app/enums/ServiceCenterActivityTypeEnum";
import { ServiceCenterActivity } from "@app/models/ServiceCenterActivity";
import ArrayHelper from "@app/helpers/ArrayHelper";



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

    public getServiceCenterLastActivityType = async (activityType: ServiceCenterActivityTypeEnum) => {
        let lastActivityType = null;
        switch (activityType) {
            case ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ORDER_ACCEPTED:
                lastActivityType = ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ALLOCATED;
                break;
            case ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED:
                lastActivityType = ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ALLOCATED;
                break;
            case ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED_AFTER_INSPECTION:
                lastActivityType = ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ORDER_ACCEPTED;
                break;
            case ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_DECLINED_PAYMENT:
                lastActivityType = ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_TO_CONFIRM;
                break;
            case ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_INSPECTION_FEE_CLAIMED:
                lastActivityType = [ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED_AFTER_INSPECTION, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_DECLINED_PAYMENT];
                break;
            case ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_READY_TO_DISPATCH:
                lastActivityType = ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_MADE_PAYMENT;
                break;
            case ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_DISPATCHED:
                lastActivityType = ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_READY_TO_DISPATCH;
                break;
            case ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_FAILURE:
                lastActivityType = ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_MADE_PAYMENT;
                break;
            default:
                break;
        }
        return lastActivityType;
    }

    public isLastDBActivityValid = async (serviceCenterDBActivities: ServiceCenterActivity[], activityType: ServiceCenterActivityTypeEnum) => {
        let isLastDBActivityValid = false;
        if (ArrayHelper.isArrayValid(serviceCenterDBActivities)) {
            let lastDBActivity = serviceCenterDBActivities[serviceCenterDBActivities.length - 1].activity_type;
            isLastDBActivityValid = activityType === lastDBActivity;
        }
        return isLastDBActivityValid;
    }
}

export const serviceCenterServiceIns = new ServiceCenterService();