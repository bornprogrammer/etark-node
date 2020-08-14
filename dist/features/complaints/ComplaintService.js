"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.complaintServiceIns = exports.ComplaintService = void 0;
const BaseService_1 = __importDefault(require("@app/services/BaseService"));
const ComplaintRepository_1 = require("./ComplaintRepository");
const ComplaintRepository_2 = require("@app/repositories/ComplaintRepository");
const HttpPostService_1 = require("@app/http-services/HttpPostService");
const AppConstants_1 = require("@app/constants/AppConstants");
const ChancesOfWinningMLCasesService_1 = require("@app/services/ChancesOfWinningMLCasesService");
const ComplaintDetails_1 = require("@app/models/ComplaintDetails");
const ComplaintDetailsRepository_1 = require("@app/repositories/ComplaintDetailsRepository");
const StoreResultAs_1 = require("@app/enums/StoreResultAs");
const ArrayHelper_1 = __importDefault(require("@app/helpers/ArrayHelper"));
const ComplaintDetailByFieldNameParamsEntity_1 = require("@app/repo-method-param-entities/ComplaintDetailByFieldNameParamsEntity");
const SmartphoneComplainFieldsEnum_1 = require("@app/enums/SmartphoneComplainFieldsEnum");
const ObjectHelper_1 = require("@app/helpers/ObjectHelper");
class ComplaintService extends BaseService_1.default {
    /**
     *
     */
    constructor() {
        super();
        this.addComplaints = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let result = yield this.getMethodCoordinator().setMethod({ callableFunction: ComplaintRepository_1.complaintRepositoryIns.addComplaints, callableFunctionParams: params }).setMethod({ callableFunction: ComplaintRepository_1.complaintRepositoryIns.addComplaintDetails }).coordinate();
            return result;
        });
        this.addDeviceImages = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let result = yield this.getMethodCoordinator().setMethod({ callableFunction: ComplaintRepository_1.complaintRepositoryIns.addDeviceImages, callableFunctionParams: params }).coordinate();
            return result;
        });
        this.uploadInvoice = (methodParamEntity) => {
            let params = methodParamEntity.topMethodParam;
            let uploadedInvoiceParams = { file_name: params.filename };
            return uploadedInvoiceParams;
        };
        this.getChancesOfWinning = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            params.field_name = SmartphoneComplainFieldsEnum_1.SmartphoneComplainFieldsEnum.PROBLEM_DESCRIPTION;
            let result = yield this.getMethodCoordinator().setMethod({ callableFunction: this.getComplaintDetails, callableFunctionParams: params }).setMethod({ callableFunction: this.callWinningChancesMLApi, resultToBeReturnedAsFinalResult: true }).setMethod({ callableFunction: this.updateWinningOfChances }).coordinate();
            return result;
        });
        this.getComplaintDetails = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let getComplaintDetailsParams = new ComplaintDetailByFieldNameParamsEntity_1.ComplaintDetailByFieldNameParamsEntity(params.complaint_id, params.field_name);
            let result = yield ComplaintRepository_2.complaintRepositoryIns.getComplaintDetailByFieldName(getComplaintDetailsParams);
            // return { fieldVal: result.field_val, fieldId: result.field_id, complain_detail_id: result.id };
            return result;
        });
        this.callWinningChancesMLApi = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let complainDetails = methodParamEntity.lastInvokedMethodParam;
            let winningChances = null;
            if (complainDetails) {
                winningChances = yield HttpPostService_1.httpPostServiceIns(AppConstants_1.AppConstants.ML_MODEL_CHANCES_OF_WINNING_URL).setFormUrlEncodedPayload({ com: complainDetails.field_val }).setExpectedResponseAsJson().call();
            }
            return ChancesOfWinningMLCasesService_1.chancesOfWinningMLCasesServiceIns.getHigherChances(winningChances);
        });
        this.updateWinningOfChances = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            params.winningChances = methodParamEntity.lastInvokedMethodParam.winning_chances_val;
            params.field_name = SmartphoneComplainFieldsEnum_1.SmartphoneComplainFieldsEnum.WINNING_CHANCES_ML_RESPONSE;
            let result = yield this.getMethodCoordinator().setMethod({ callableFunction: this.getComplaintDetails, callableFunctionParams: params, notBreakWhenReturnedValueNotTruthy: true }).setMethod({ callableFunction: this.upsertWinningOfChances }).coordinate();
            return result;
        });
        this.upsertWinningOfChances = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let complaintDetails = methodParamEntity.lastInvokedMethodParam;
            let params = methodParamEntity.topMethodParam;
            if (!complaintDetails) {
                complaintDetails = new ComplaintDetails_1.ComplaintDetails();
                complaintDetails.field_val = params.winningChances;
                complaintDetails.field_id = 18;
                complaintDetails.complaint_id = params.complaint_id;
                yield ComplaintDetailsRepository_1.complaintDetailsRepositoryIns.create([complaintDetails]);
            }
            else {
                yield ComplaintDetailsRepository_1.complaintDetailsRepositoryIns.update({ field_val: params.winningChances, complain_detail_id: complaintDetails.id });
            }
            return true;
        });
        this.addCompensation = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let result = this.getMethodCoordinator().setMethod({ callableFunction: this.createComplainDetail, callableFunctionParams: params, storeResultAs: StoreResultAs_1.StoreResultAs.ADD_COMPENSATION }).setMethod({ callableFunction: this.getComplaintDetailByFieldNameAmount, callableFunctionParams: SmartphoneComplainFieldsEnum_1.SmartphoneComplainFieldsEnum.PHONE_PRICE }).setMethod({ callableFunction: this.callCompensationAmountMLApi }).setMethod({ callableFunction: this.createCompensationMLResponse }).coordinate();
            return result;
        });
        this.createComplainDetail = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let complaintDetailsObj = this.buildComplainDetailsInsForCompensation(params);
            let result = yield ComplaintDetailsRepository_1.complaintDetailsRepositoryIns.create([complaintDetailsObj]);
            return result[0];
        });
        this.getComplaintDetailByFieldNameAmount = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let getComplaintDetailsParams = new ComplaintDetailByFieldNameParamsEntity_1.ComplaintDetailByFieldNameParamsEntity(params.complain_id, methodParamEntity.methodParam);
            let result = yield ComplaintRepository_2.complaintRepositoryIns.getComplaintDetailByFieldName(getComplaintDetailsParams);
            return { fieldVal: result.field_val, fieldId: result.field_id, complain_detail_id: result.id };
        });
        this.callCompensationAmountMLApi = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let fieldVal = methodParamEntity.lastInvokedMethodParam;
            let callApi = yield HttpPostService_1.httpPostServiceIns(AppConstants_1.AppConstants.ML_MODEL_COMPENSATION_URL).setFormUrlEncodedPayload({ amount: fieldVal.fieldVal }).setExpectedResponseAsJson().call();
            return callApi;
        });
        this.createCompensationMLResponse = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let compensationMLResponse = methodParamEntity.lastInvokedMethodParam;
            params.ml_resp = compensationMLResponse;
            let result = yield ComplaintDetailsRepository_1.complaintDetailsRepositoryIns.create([this.buildComplainDetailsInsForMLCompensationResp(params)]);
            return methodParamEntity.methodReturnedValContainer[StoreResultAs_1.StoreResultAs.ADD_COMPENSATION];
        });
        this.updateCompensationVal = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            params.field_val = params.compensation_type;
            let result = yield ComplaintDetailsRepository_1.complaintDetailsRepositoryIns.update(params);
            return result;
        });
        this.updateCompensation = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let result = this.getMethodCoordinator().setMethod({ callableFunction: this.updateCompensationVal, callableFunctionParams: params }).setMethod({ callableFunction: this.getComplaintDetailByFieldNameAmount, callableFunctionParams: SmartphoneComplainFieldsEnum_1.SmartphoneComplainFieldsEnum.PHONE_PRICE }).setMethod({ callableFunction: this.callCompensationAmountMLApi, storeResultAs: StoreResultAs_1.StoreResultAs.COMPENSATION_ML_API_RESP }).setMethod({ callableFunction: this.getComplaintDetailByFieldNameAmount, callableFunctionParams: SmartphoneComplainFieldsEnum_1.SmartphoneComplainFieldsEnum.COMPENSATION_ML_RESPONSE }).setMethod({ callableFunction: this.updateCompensationMLResponse }).coordinate();
            return result;
        });
        this.updateCompensationMLResponse = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let complainDetailObj = methodParamEntity.lastInvokedMethodParam;
            params.field_val = methodParamEntity.methodReturnedValContainer[StoreResultAs_1.StoreResultAs.COMPENSATION_ML_API_RESP];
            params.complain_detail_id = complainDetailObj.complain_detail_id;
            let result = yield ComplaintDetailsRepository_1.complaintDetailsRepositoryIns.update(params);
            return result;
        });
        this.buildComplainDetailsInsForCompensation = (params) => {
            let complaintDetails = new ComplaintDetails_1.ComplaintDetails();
            complaintDetails.field_val = params.compensation_type; // free_servicing,product_replacement
            complaintDetails.complaint_id = params.complain_id;
            complaintDetails.field_id = 17;
            return complaintDetails;
        };
        this.buildComplainDetailsInsForMLCompensationResp = (params) => {
            let complaintDetails = new ComplaintDetails_1.ComplaintDetails();
            complaintDetails.field_val = params.ml_resp;
            complaintDetails.complaint_id = params.complain_id;
            complaintDetails.field_id = 19;
            return complaintDetails;
        };
        this.getIMEIFieldValue = (complaintDetails) => {
            let imeiNumber = null;
            if (ArrayHelper_1.default.isArrayValid(complaintDetails)) {
                complaintDetails.forEach(complaintDetail => {
                    if (complaintDetail.field.field_name === SmartphoneComplainFieldsEnum_1.SmartphoneComplainFieldsEnum.IMEI_NUMBER) {
                        imeiNumber = complaintDetail.field_val;
                    }
                });
            }
            return imeiNumber;
        };
        this.getComplainDetailsForServiceCenterEmail = (orderId) => __awaiter(this, void 0, void 0, function* () {
            let result = yield ComplaintRepository_2.complaintRepositoryIns.getComplainDetailsForServiceCenterEmail(orderId);
            let sellerCompensationEmailEntity = this.extractInfo(result);
            return sellerCompensationEmailEntity;
        });
        this.extractInfo = (complaint) => {
            let details = null;
            if (ObjectHelper_1.ObjectHelper.isObjectNotEmpty(complaint)) {
                details = { company_name: "", user_name: "", product_detail: "", compensation_value: "", imei_number: "", model_name: "", winning_chances: "" };
                details.user_name = complaint.user.name;
                details.company_name = complaint.makerDetail.display_name;
                complaint.complainDetails.forEach(complainDetail => {
                    if (complainDetail.field.field_name === SmartphoneComplainFieldsEnum_1.SmartphoneComplainFieldsEnum.IMEI_NUMBER) {
                        details.imei_number = complainDetail.field_val;
                    }
                    else if (complainDetail.field.field_name === SmartphoneComplainFieldsEnum_1.SmartphoneComplainFieldsEnum.COMPENSATION_ML_RESPONSE) {
                        details.compensation_value = complainDetail.field_val;
                    }
                    else if (complainDetail.field.field_name === SmartphoneComplainFieldsEnum_1.SmartphoneComplainFieldsEnum.WINNING_CHANCES_ML_RESPONSE) {
                        details.winning_chances = complainDetail.field_val;
                    }
                    else if (complainDetail.field.field_name === SmartphoneComplainFieldsEnum_1.SmartphoneComplainFieldsEnum.MODEL_NAME) {
                        details.model_name = complainDetail.field_val;
                        details.product_detail = complainDetail.field_val;
                    }
                });
            }
            return details;
        };
    }
}
exports.ComplaintService = ComplaintService;
exports.complaintServiceIns = new ComplaintService();
//# sourceMappingURL=ComplaintService.js.map