import BaseRepository from "@app/services/BaseRepository";
import { ComplaintDetails } from "@app/models/ComplaintDetails";

export class ComplaintDetailsRepository extends BaseRepository {

    public create(params: ComplaintDetails[]) {
        // let result = 
    }

}

export const complaintDetailsRepositoryIns = new ComplaintDetailsRepository();