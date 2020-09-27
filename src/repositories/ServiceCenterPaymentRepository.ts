import { ServiceCenterPayment, ServiceCenterPaymentAttributes } from "@app/models/ServiceCenterModel";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { QueryTypes } from "sequelize";
import BaseRepository from "./BaseRepository";


export class ServiceCenterPaymentRepository extends BaseRepository {

    public create = async (params: ServiceCenterPaymentAttributes) => {
        let result = await ServiceCenterPayment.create({
            service_center_order_id: params.service_center_order_id
        })
        return result;
    }

    public updateOrderNo = async (params: ServiceCenterPaymentAttributes) => {
        let result = await ServiceCenterPayment.update({
            order_no: params.order_no
        }, {
            where: {
                id: params.id,
                payment_status: 'pending'
            }
        })
        return result;
    }

    public updatePaymentStatus = async (params: ServiceCenterPaymentAttributes) => {
        let result = await ServiceCenterPayment.update({
            payment_status: params.payment_status,
            gateway_response: params.gateway_response
        }, {
            where: {
                id: params.id,
                payment_status: 'pending'
            }
        })
        return result;
    }

    public getPickupDeliveryId = async (servicCenterPayemntId: number) => {
        let query = `select service_center_orders.pickup_delivery_id
        from service_center_payments inner join service_center_orders on service_center_payments.service_center_order_id = service_center_orders.id
        where service_center_payments.id=:servicCenterPayemntId and service_center_payments.payment_status='completed'`;
        let result = await sequelizeConnection.connection.query(query, { type: QueryTypes.SELECT, replacements: { servicCenterPayemntId } });
        return result;
    }

    public getServiceCenterPaymentDetails = async (servicCenterPayemntId: number) => {
        let query = `select * from service_center_payments where id=:servicCenterPayemntId`;
        let result = await sequelizeConnection.connection.query(query, { type: QueryTypes.SELECT, replacements: { servicCenterPayemntId } });
        return result;
    }

    public getServiceCenterPaymentId = async (pickupDeliveryId: number) => {
        let query = `select service_center_payments.id as service_center_payment_id
        from service_center_orders inner join service_center_payments on service_center_orders.id = service_center_payments.service_center_order_id
        and service_center_payments.payment_status='pending' and service_center_orders.pickup_delivery_id=:pickupDeliveryId`;
        let result = await sequelizeConnection.connection.query(query, { type: QueryTypes.SELECT, replacements: { pickupDeliveryId } });
        return result;
    }
}

export const serviceCenterPaymentRepositoryIns = new ServiceCenterPaymentRepository();