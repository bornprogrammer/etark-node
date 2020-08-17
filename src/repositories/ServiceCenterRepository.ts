import BaseRepository from "./BaseRepository";
import { Complaint } from "@app/models/Complaint";

export class ServiceCenterRepository extends BaseRepository {
    /**
     *
     */
    constructor() {
        super();
    }

    public create(params: any) {

    }

    public getList = async (scId: number) => {
        let result = await Complaint.scope(['complainDetails', 'getSuccessUserPlan', { method: ['getDeliveryDetails', scId] }]).findAll({
        });
        return result;
    }
}

export const serviceCenterRepositoryIns = new ServiceCenterRepository();