import MethodParamEntity from "@app/entities/MethodParamEntity";
import UnAuthorized from "@app/errors/UnAuthorized";
import { retailCustomerDetailRepositoryIns } from "@app/repositories/RetailCustomerDetailRepository";
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

    public processCustomerDetails = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.addCustomerDetails, callableFunctionParams: params }).coordinate();
        if (!result) {
            throw new UnAuthorized();
        }
        return result;
    }

    public addCustomerDetails = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await retailCustomerDetailRepositoryIns.create({ customer_name: params.customer_name, bill_id: params.bill_id, contact: params.contact, email: params.email, maker_id: params.maker_id });
        return result;
    }

    public getRetailerList = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await retailerRepositoryIns.getRetailerList(params);
        return result;
    }
}

export const retailerRepositoryServiceIns = new RetailerRepositoryService();