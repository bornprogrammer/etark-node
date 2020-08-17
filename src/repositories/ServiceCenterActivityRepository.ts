import BaseRepository from "./BaseRepository";
import { ServiceCenterActivityAttributes, ServiceCenterActivity } from "@app/models/ServiceCenterActivity";



export class ServiceCenterActivityRepository extends BaseRepository {
    /**
     *
     */
    constructor() {
        super();
    }

    public create(params: ServiceCenterActivityAttributes) {
        let result = ServiceCenterActivity.create({
            pickup_delivery_id: params.pickup_delivery_id,
            activity_type: params.activity_type
        });
        return result;
    }

}

export const serviceCenterActivityRepositoryIns = new ServiceCenterActivityRepository();