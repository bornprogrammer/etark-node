import BaseService from "@app/services/BaseService";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { userPlanRepositoryIns } from "./UserPlanRepository";

export class UserPlanService extends BaseService {

    /**
     *
     */
    constructor() {
        super();
    }

    public paytmCallback = async (methodParamEntity: MethodParamEntity) => {
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: userPlanRepositoryIns.paytmCallback, callableFunctionParams: methodParamEntity.topMethodParam }).coordinate();
    }

    public addPlan = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: userPlanRepositoryIns.addPlan, callableFunctionParams: params }).setMethod({ callableFunction: userPlanRepositoryIns.addUserPlanComponents }).coordinate();
        return result;
    }

}

export const userPlanServiceIns = new UserPlanService();