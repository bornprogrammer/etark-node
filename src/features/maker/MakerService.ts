import BaseService from "@app/services/BaseService";
import MethodParamEntity from "@app/entities/MethodParamEntity";


export class MakerService extends BaseService {

    /**
     *
     */
    constructor() {
        super();
    }

    public getMakerListByCategoryId = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        // let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.}).coordinate();
    }
}

export const makerServiceIns = new MakerService();