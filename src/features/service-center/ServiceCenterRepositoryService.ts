import { BaseRepositoryService } from "@app/services/BaseRepositoryService";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { serviceCenterActivityRepositoryIns } from "@app/repositories/ServiceCenterActivityRepository";

export class ServiceCenterRepositoryService extends BaseRepositoryService {

    /**
     *
     */
    constructor() {
        super();
    }

    public getOrderList = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = "";
    }

    public addAllocatedServiceCenterActivity = async (pickupDeliveryId: number) => {
        let result = await serviceCenterActivityRepositoryIns.create({ activity_type: "allocated", pickup_delivery_id: pickupDeliveryId })
        return result;
    }
}

export const serviceCenterRepositoryServiceIns = new ServiceCenterRepositoryService();