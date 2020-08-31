import { BaseQueue } from "./BaseQueue";
import { EventEmitterIdentifierEnum } from "@app/enums/EventEmitterIdentifierEnum";
import { AfterAddingAddressEventEmitterEntity } from "@app/entities/AfterAddingAddressEventEmitterEntity";
import { userRepositoryServiceIns } from "@app/features/users/UserRepositoryService";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { serviceCenterRepositoryServiceIns } from "@app/features/service-center/ServiceCenterRepositoryService";
import { PickupDelivery } from "@app/models/PickupDelivery";

export class AfterAddingAddressEventEmitter extends BaseQueue {
    /**
     *
     */
    constructor() {
        super(EventEmitterIdentifierEnum.AFTER_ADDING_ADDRESS_EVENTEMITTER);
    }

    public async handleJob(data?: AfterAddingAddressEventEmitterEntity) {
        await this.processPickupNDelivery(data);
    }

    public processPickupNDelivery = async (params: AfterAddingAddressEventEmitterEntity) => {
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.upsertPickupDelivery, callableFunctionParams: params }).setMethod({ callableFunction: this.addServiceCenterActivity }).coordinate();
    }

    public upsertPickupDelivery = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let pickupDeliveryAttirbutes = { user_plan_id: params.userPlanId, service_center_id: params.serviceCenterId, delivery_amount: params.deliveryAmount, distance_meters: params.distance };
        let result = await userRepositoryServiceIns.upsertPickupDelivery(pickupDeliveryAttirbutes);
        return result;
    }

    public addServiceCenterActivity = async (params: MethodParamEntity) => {
        let lastInvokedMethodParam = params.lastInvokedMethodParam;
        let result = null;
        if (lastInvokedMethodParam instanceof PickupDelivery) {
            result = serviceCenterRepositoryServiceIns.addAllocatedServiceCenterActivity(lastInvokedMethodParam.id);
        }
        return result;
    }



}

export const afterAddingAddressEventEmitterIns = new AfterAddingAddressEventEmitter();