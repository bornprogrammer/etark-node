import BaseRepository from "./BaseRepository";
import { ServiceCenterActivityAttributes, ServiceCenterActivity } from "@app/models/ServiceCenterActivity";



export class ServiceCenterActivityRepository extends BaseRepository {
    /**
     *
     */
    constructor() {
        super();
    }

    public create = async (params: ServiceCenterActivityAttributes) => {
        let result = await ServiceCenterActivity.create({
            pickup_delivery_id: params.pickup_delivery_id,
            activity_type: params.activity_type
        });
        return result;
    }

    public removeServiceCenter = async (pickupDeliveryID: number) => {
        let result = await ServiceCenterActivity.update({
            status: "service_denied"
        }, {
            where: {
                id: pickupDeliveryID
            }
        });
        return result;
    }

}

export const serviceCenterActivityRepositoryIns = new ServiceCenterActivityRepository();