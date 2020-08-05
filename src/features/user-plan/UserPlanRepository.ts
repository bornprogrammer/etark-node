
import BaseRepository from "@app/services/BaseRepository";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { UserPaymentDetails } from "@app/models/UserPaymentDetails";
import { UserPlan } from "@app/models/UserPlan";

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

    public addPlan = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let addUserPlanParams = {
            complain_id: params.complain_id,
            plan_id: params.plan_id,
        };
        let result = await UserPlan.create(addUserPlanParams);
        return result;
    }

    public addUserPlanComponents = async (methodParamEntity: MethodParamEntity) => {
        // let params = methodParamEntity.topMethodParam;
        // let addUserPlanParams = {
        //     complain_id: params.complain_id,
        //     plan_id: params.plan_id,
        // };
        // let result = await UserPlanComponent.create();
        let result = methodParamEntity.
        return result;
    }
}


export const userPlanRepositoryIns = new UserPlanRepository();