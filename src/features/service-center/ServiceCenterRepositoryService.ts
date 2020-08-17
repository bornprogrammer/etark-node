import { BaseRepositoryService } from "@app/services/BaseRepositoryService";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { serviceCenterActivityRepositoryIns } from "@app/repositories/ServiceCenterActivityRepository";
import { serviceCenterRepositoryIns } from "@app/repositories/ServiceCenterRepository";

export class ServiceCenterRepositoryService extends BaseRepositoryService {

    /**
     *
     */
    constructor() {
        super();
    }

    public getOrderList = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await serviceCenterRepositoryIns.getList(params.sc_id);
        return result;
    }

    public addAllocatedServiceCenterActivity = async (pickupDeliveryId: number) => {
        let result = await serviceCenterActivityRepositoryIns.create({ activity_type: "allocated", pickup_delivery_id: pickupDeliveryId })
        return result;
    }
}

export const serviceCenterRepositoryServiceIns = new ServiceCenterRepositoryService();