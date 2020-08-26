import BaseService from "@app/services/BaseService";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { MasterRepository, masterRepositoryIns } from "./MasterRepository";
import { GoogleDistanceMapApiEntity } from "@app/entities/GoogleDistanceMapApiEntity";
import BadHttpRequestError from "@app/errors/BadHttpRequestError";

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

    public getPlans = async () => {
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.mMasterRepository.getPlans }).coordinate();
        return result;
    }

    public getCities = async () => {
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.mMasterRepository.getCities }).coordinate();
        return result;
    }

    public testApi = async (methodParamEntity: MethodParamEntity) => {
        let origins: GoogleDistanceMapApiEntity[] = [{ lat: "28.412932", long: "77.033878" }];
        let dests: GoogleDistanceMapApiEntity[] = [{ lat: "28.453729", long: "77.039494" }, { lat: "28.510637", long: "77.048866" }, { lat: "28.471032", long: "77.049519" }];
        // let result = await googleDistanceMapApiServiceIns.getMinDistance(origins, dests);
        return true;
    }
}

export const masterServiceIns = new MasterService(masterRepositoryIns);