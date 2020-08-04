
import BaseRepository from "@app/services/BaseRepository";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { UserPaymentDetails } from "@app/models/UserPaymentDetails";



export class UserPlanRepository extends BaseRepository {


    /**
     *
     */
    constructor() {
        super();
    }

    public paytmCallback = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        // let userPaymentDetails = {};
        let result = await UserPaymentDetails.create({
            gateway_response: JSON.stringify(params.resp)
        });
        return result;
    }
}


export const userPlanRepositoryIns = new UserPlanRepository();