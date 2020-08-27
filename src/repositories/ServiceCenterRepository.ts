import BaseRepository from "./BaseRepository";
import { Complaint } from "@app/models/Complaint";
import { GetServiceCenterOrderListParamsEntity } from "@app/repo-method-param-entities/GetServiceCenterOrderListParamsEntity";
import { ServiceCenterActivity } from "@app/models/ServiceCenterActivity";
import { GetServiceCenterAllActivitiesDetailsParamsEntity } from "@app/repo-method-param-entities/GetServiceCenterAllActivitiesDetailsParamsEntity";

export class ServiceCenterRepository extends BaseRepository {
    /**
     *
     */
    constructor() {
        super();
    }

    public create(params: any) {

    }

    public getServiceCenterOrderList = async (params: GetServiceCenterOrderListParamsEntity) => {
        let result = await Complaint.scope(['complainDetails', 'getSuccessUserPlan', { method: ['getDeliveryDetails', params.serviceCenterId, params.activityTypes] }]).findAll({
            limit: params.pagination.limit,
            offset: params.pagination.offset,
            order: [[
                'id', 'desc'
            ]]
        });
        return result;
    }

    public getServiceCenterAllActivitiesDetails = async (params: GetServiceCenterAllActivitiesDetailsParamsEntity) => {
        let result = await ServiceCenterActivity.findAll({
            attributes: [
                'activity_type'
            ],
            where: {
                pickup_delivery_id: params.pickupDeliveryId
            },
            order: [
                ['id', 'asc']
            ]
        })
        return result;
    }
}

export const serviceCenterRepositoryIns = new ServiceCenterRepository();