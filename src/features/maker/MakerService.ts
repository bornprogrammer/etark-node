import BaseService from "@app/services/BaseService";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { MakerRepository, makerRepositoryIns } from "./MakerRepository";


export class MakerService extends BaseService {

    private mMakerRepository: MakerRepository;
    /**
     *
     */
    constructor(makerRepository: MakerRepository) {
        super();
        this.mMakerRepository = makerRepository;
    }

    public getMakerListByCategoryId = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.mMakerRepository.getMakerListByCategoryId, callableFunctionParams: params }).coordinate();
        return result;
    }
}

export const makerServiceIns = new MakerService(makerRepositoryIns);