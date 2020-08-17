import BaseRepository from "./BaseRepository";
import { PickupDelivery, PickupDeliveryAttirbutes } from "@app/models/PickupDelivery";
import { FindPickpDeliveryByUserPlanIdParamsEntity } from "@app/repo-method-param-entities/FindPickpDeliveryByUserPlanIdParamsEntity";

export class PickupDeliveyRepository extends BaseRepository {

    public create = async (params: PickupDeliveryAttirbutes): Promise<PickupDelivery> => {
        let result = await PickupDelivery.create({
            user_plan_id: params.user_plan_id,
            service_center_id: params.service_center_id,
            delivery_amount: params.delivery_amount,
            distance_meters: params.distance_meters
        })
        return result;
    }

    public findPickpDeliveryByUserPlanId = async (params: FindPickpDeliveryByUserPlanIdParamsEntity): Promise<PickupDelivery> => {
        let result = await PickupDelivery.findOne({
            where: {
                user_plan_id: params.userPlanId,
                status: params.status
            }
        })
        return result;
    }

    public update = async (params: PickupDeliveryAttirbutes) => {
        let result = await PickupDelivery.update({
            service_center_id: params.service_center_id,
            delivery_amount: params.delivery_amount,
            distance_meters: params.distance_meters
        }, {
            where: {
                id: params.id
            }
        });
        return result;
    }

    public upsert = async (params: PickupDeliveryAttirbutes) => {
        let result = await this.findPickpDeliveryByUserPlanId(new FindPickpDeliveryByUserPlanIdParamsEntity(params.user_plan_id));
        if (result) {
            params.id = result.id;
            await this.update(params);
        } else {
            await this.create(params);
        }
        return true;
    }

    public markPickupDeliverySuccess = async (userPlanId: number) => {
        let result = await PickupDelivery.update({
            status: 'success'
        }, {
            where: {
                user_plan_id: userPlanId
            }
        })
        return result;
    }

}

export const pickupDeliveyRepositoryIns = new PickupDeliveyRepository();