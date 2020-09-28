import MethodParamEntity from "@app/entities/MethodParamEntity";
import UnAuthorized from "@app/errors/UnAuthorized";
import { retailerRepositoryIns } from "@app/repositories/RetailerRepository";
import { BaseRepositoryService } from "@app/services/BaseRepositoryService";

export class RetailerRepositoryService extends BaseRepositoryService {

    constructor() {
        super();
    }

    public retailerLogin = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: retailerRepositoryIns.retailerLogin, callableFunctionParams: params }).coordinate();
        if (!result) {
            throw new UnAuthorized();
        }
        return result;
    }
}

export const retailerRepositoryServiceIns = new RetailerRepositoryService();