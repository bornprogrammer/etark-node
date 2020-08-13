import BaseService from "@app/services/BaseService";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { MasterRepository, masterRepositoryIns } from "./MasterRepository";
import { complaintRepositoryIns } from "@app/repositories/ComplaintRepository";
import { Complaint } from "@app/models/Complaint";
import { ObjectHelper } from "@app/helpers/ObjectHelper";
import { SellerCompensationEmailEntity } from "@app/entities/SellerCompensationEmailEntity";
import { ComplaintDetails } from "@app/models/ComplaintDetails";
import { SmartphoneComplainFieldsEnum } from "@app/enums/SmartphoneComplainFieldsEnum";
import { GoogleDistanceMapApiService, googleDistanceMapApiServiceIns } from "@app/services/GoogleDistanceMapApiService";
import { GoogleDistanceMapApiEntity } from "@app/entities/GoogleDistanceMapApiEntity";


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

    public getPlans = async (methodParamEntity: MethodParamEntity) => {
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.mMasterRepository.getPlans }).coordinate();
        return result;
    }

    public getCities = async (methodParamEntity: MethodParamEntity) => {
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.mMasterRepository.getCities }).coordinate();
        return result;
    }

    public testApi = async (methodParamEntity: MethodParamEntity) => {
        let origins: GoogleDistanceMapApiEntity[] = [{ lat: "28.412932", long: "77.033878" }];
        let dests: GoogleDistanceMapApiEntity[] = [{ lat: "28.453729", long: "77.039494" }, { lat: "28.510637", long: "77.048866" }, { lat: "28.471032", long: "77.049519" }];
        let result = await googleDistanceMapApiServiceIns.getMinDistance(origins, dests);
        return result;

    }
}

export const masterServiceIns = new MasterService(masterRepositoryIns);