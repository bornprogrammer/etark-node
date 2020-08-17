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
        // let result = await userRepositoryServiceIns.upsertPickupDelivery({ user_plan_id: data.userPlanId, service_center_id: data.serviceCenterId, delivery_amount: data.deliveryAmount, distance_meters: data.distance });
        await this.upsertPickupDelivery(data);
    }

    public upsertPickupDelivery = async (params: AfterAddingAddressEventEmitterEntity) => {
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: userRepositoryServiceIns.upsertPickupDelivery, callableFunctionParams: params }).setMethod({ callableFunction: this.addServiceCenterActivity }).coordinate();
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