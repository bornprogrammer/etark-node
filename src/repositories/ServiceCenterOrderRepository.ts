import BaseRepository from "./BaseRepository";
import { ServiceCenterOrder, ServiceCenterOrderAttributes } from "@app/models/ServiceCenterOrder";

export class ServiceCenterOrderRepository extends BaseRepository {
    /**
     *
     */
    constructor() {
        super();
    }

    public create = async (params: ServiceCenterOrderAttributes) => {
        let result = await ServiceCenterOrder.create({
            pickup_delivery_id: params.pickup_delivery_id,
            imei_number: params.imei_number,
            device_front_image: params.device_front_image,
            device_back_image: params.device_back_image,
            phone_warranty: params.phone_warranty,
            service_to_be_done: params.service_to_be_done,
            invoice_total_amount: params.invoice_total_amount,
            proforma_invoice_image: params.proforma_invoice_image,
            final_invoice_image: params.final_invoice_image,
            device_delivery_date: params.device_delivery_date,
            due_date: params.due_date
        });
        return result;
    }
}

export const serviceCenterOrderRepositoryIns = new ServiceCenterOrderRepository();