import { ServiceCenterPayment, ServiceCenterPaymentAttributes } from "@app/models/ServiceCenterModel";
import BaseRepository from "./BaseRepository";


export class ServiceCenterPaymentRepository extends BaseRepository {

    public create = async (params: ServiceCenterPaymentAttributes) => {
        let result = await ServiceCenterPayment.create({
            service_center_order_id: params.service_center_order_id
        })
        return result;
    }
}

export const serviceCenterPaymentRepositoryIns = new ServiceCenterPaymentRepository();