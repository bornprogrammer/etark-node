import { ServiceCenterActivityTypeEnum } from "@app/enums/ServiceCenterActivityTypeEnum";


export interface AddServiceCenterActivityEntity {
    pickupDeliveryId: number;
    activityType: ServiceCenterActivityTypeEnum;
}