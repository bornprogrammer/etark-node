import BaseService from "@app/services/BaseService";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { MasterRepository, masterRepositoryIns } from "./MasterRepository";


export class MasterService extends BaseService {

    private mMasterRepository: MasterRepository;
    /**
     *
     */
    constructor(masterRepository: MasterRepository) {
        super();
        this.mMasterRepository = masterRepository;
    }

    public getMakerListByCategoryId = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.mMasterRepository.getMakerListByCategoryId, callableFunctionParams: params }).coordinate();
        return result;
    }

    public getMerchantList = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.mMasterRepository.getMerchantList, callableFunctionParams: params }).coordinate();
        return result;
    }
}

export const masterServiceIns = new MasterService(masterRepositoryIns);