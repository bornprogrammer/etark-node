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

    public getList = async (params: any) => {
        let result = Complaint.findAll({

        });
        return result;
    }
}

export const serviceCenterRepositoryIns = new ServiceCenterRepository();