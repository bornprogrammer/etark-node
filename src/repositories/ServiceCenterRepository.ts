import BaseRepository from "./BaseRepository";
import { Complaint } from "@app/models/Complaint";
import { GetServiceCenterOrderListParamsEntity } from "@app/repo-method-param-entities/GetServiceCenterOrderListParamsEntity";

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
}

export const serviceCenterRepositoryIns = new ServiceCenterRepository();