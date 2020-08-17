import { BaseRepositoryService } from "@app/services/BaseRepositoryService";
import MethodParamEntity from "@app/entities/MethodParamEntity";


export class ServiceCenterRepositoryService extends BaseRepositoryService {

    /**
     *
     */
    constructor() {
        super();
    }

    public getOrderList = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = "";
    }

}

export const serviceCenterRepositoryServiceIns = new ServiceCenterRepositoryService();