import { BaseQueue } from "./BaseQueue";
import { EventEmitterIdentifierEnum } from "@app/enums/EventEmitterIdentifierEnum";
import { AfterAddingAddressEventEmitterEntity } from "@app/entities/AfterAddingAddressEventEmitterEntity";
import { userRepositoryServiceIns } from "@app/features/users/UserRepositoryService";

export class AfterAddingAddressEventEmitter extends BaseQueue {

    /**
     *
     */
    constructor() {
        super(EventEmitterIdentifierEnum.AFTER_ADDING_ADDRESS_EVENTEMITTER);
    }

    public async handleJob(data?: AfterAddingAddressEventEmitterEntity) {
        let result = await userRepositoryServiceIns.upsertPickupDelivery({ user_plan_id: data.userPlanId, service_center_id: data.serviceCenterId, delivery_amount: data.deliveryAmount, distance_meters: data.distance });
    }

}

export const afterAddingAddressEventEmitterIns = new AfterAddingAddressEventEmitter();