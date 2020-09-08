import BaseRepository from "./BaseRepository";
import { DeviceDispatchDetailsAttributes, DeviceDispatchDetails } from "@app/models/DeviceDispatchDetails";

export class DeviceDispatchDetailsRepository extends BaseRepository {
    /**
     *
     */
    constructor() {
        super();
    }

    public create = async (params: DeviceDispatchDetailsAttributes) => {
        let result = await DeviceDispatchDetails.create({
            pick_delivery_id: params.pick_delivery_id,
            device_front_image: params.device_front_image,
            device_back_image: params.device_back_image,
            final_invoice_image: params.final_invoice_image,
            final_invoice_amount: params.final_invoice_amount
        })
        return result;
    }
}

export const deviceDispatchDetailsRepositoryIns = new DeviceDispatchDetailsRepository();