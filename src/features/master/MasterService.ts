import BaseService from "@app/services/BaseService";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { MasterRepository, masterRepositoryIns } from "./MasterRepository";
import { GoogleDistanceMapApiEntity } from "@app/entities/GoogleDistanceMapApiEntity";
import BadHttpRequestError from "@app/errors/BadHttpRequestError";
import { userRepositoryServiceIns } from "../users/UserRepositoryService";
import { complaintRepositoryIns } from "@app/repositories/ComplaintRepository";
import { FieldDetails } from "@app/models/FieldDetails";
import { SmartphoneComplainFieldsEnum } from "@app/enums/SmartphoneComplainFieldsEnum";
import { fileReaderServiceIns } from "@app/services/FileReaderService";
import { htmlToPDFConverterIns } from "@app/services/HTMLToPDFConverter";
import { Utils } from "sequelize";
import { UtilsHelper } from "@app/helpers/UtilsHelper";
import { complaintServiceIns } from "../complaints/ComplaintRepositoryService";
import { afterPaytmCallbackEventEmitterIns } from "@app/events/AfterPaytmCallbackEventEmitter";
import { serviceCenterRepositoryIns } from "@app/repositories/ServiceCenterRepository";

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
        // let origins: GoogleDistanceMapApiEntity[] = [{ lat: "28.412932", long: "77.033878" }];
        // let dests: GoogleDistanceMapApiEntity[] = [{ lat: "28.453729", long: "77.039494" }, { lat: "28.510637", long: "77.048866" }, { lat: "28.471032", long: "77.049519" }];
        // return await afterPaytmCallbackEventEmitterIns.generateInvoiceReport({ topMethodParam: { ORDERID: "E-Tark661" } });
        // return await serviceCenterRepositoryIns.getInProcessOrderCount(29);
        await htmlToPDFConverterIns.convertInvoiceReport(null, this.convertToPDF.bind(null, null, null));
        // let result = await googleDistanceMapApiServiceIns.getMinDistance(origins, dests);
        // fileReaderServiceIns.readEmailTemplate("complaint-report.html", this.convertToPDF.bind(null, result));
        // return objectDetails;
    }

    public convertToPDF = async (objectDetails, error, data) => {

    }
}

export const masterServiceIns = new MasterService(masterRepositoryIns);