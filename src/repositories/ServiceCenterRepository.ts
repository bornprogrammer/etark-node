import BaseRepository from "./BaseRepository";
import { Complaint } from "@app/models/Complaint";
import { GetServiceCenterListParamsEntity } from "@app/repo-method-param-entities/GetClosestServiceCenterDetailsParamsEntity";
import { GetServiceCenterOrderList } from "@app/repo-method-param-entities/GetServiceCenterOrderList";

export class ServiceCenterRepository extends BaseRepository {
    /**
     *
     */
    constructor() {
        super();
    }

    public create(params: any) {

    }

    public getServiceCenterOrderList = async (params: GetServiceCenterOrderList) => {
        let result = await Complaint.scope(['complainDetails', 'getSuccessUserPlan', { method: ['getDeliveryDetails', params.serviceCenterId, params.activityTypes] }]).findAll({
            limit: params.pagination.limit,
            offset: params.pagination.offset
        });
        return result;
    }
}

export const serviceCenterRepositoryIns = new ServiceCenterRepository();