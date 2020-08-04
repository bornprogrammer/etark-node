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

}

export const userPlanServiceIns = new UserPlanService();