
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { StoreResultAs } from "@app/enums/StoreResultAs";
import { planRepositoryIns } from "@app/repositories/PlanRepository";
import { GetUserPlanComponentDetailsParamsEntity } from "@app/repo-method-param-entities/GetUserPlanComponentDetailsParamsEntity";
import { GetPlanComponentDetailsParamsEntity } from "@app/repo-method-param-entities/GetPlanComponentDetailsParamsEntity";
import { userPlanRepositoryIns } from "@app/repositories/UserPlanRepository";
import { AddUserPlanComponentsParamsEntity } from "@app/repo-method-param-entities/AddUserPlanComponentsParamsEntity";
import { AddUserPlanParamEntity } from "@app/repo-method-param-entities/AddUserPlanParamEntity";
import { userPlanComponentRepositoryIns } from "@app/repositories/UserPlanComponentRepository";
import { UserPayment, UserPaymentAttributes } from "@app/models/UserPayment";
import { userPaymentRepositoryIns } from "@app/repositories/UserPaymentRepository";
import { paytmServiceIns } from "@app/services/PaytmService";
import { AppConstants } from "@app/constants/AppConstants";
import { UpdateUserPaymentStatusParamsEntity } from "@app/repo-method-param-entities/UpdateUserPaymentStatusParamsEntity";
import { userPaymentDetailsRepositoryIns } from "@app/repositories/UserPaymentDetailsRepository";
import { UserPaymentDetails } from "@app/models/UserPaymentDetails";
import { BaseRepositoryService } from "@app/services/BaseRepositoryService";
import { userPlanServiceIns, UserPlanService } from "./UserPlanService";
import { UpdateUserPaymentStatusError } from "@app/errors/UpdateUserPaymentStatusError";
import { afterPaytmCallbackEventEmitterIns } from "@app/events/AfterPaytmCallbackEventEmitter";
import { EventEmitterIdentifierEnum } from "@app/enums/EventEmitterIdentifierEnum";
import { PaytmCallbackResponseEntity } from "@app/entities/PaytmCallbackResponseEntity";
import { GetUserPlanStatusByUserPaymentIdParamsEntity } from "@app/repo-method-param-entities/GetUserPlanStatusByUserPaymentIdParamsEntity";
import { UserPlan } from "@app/models/UserPlan";
import { pickupDeliveyRepositoryIns } from "@app/repositories/PickupDeliveyRepository";
import { PaytmRefundParamsEntity } from "@app/entities/PaytmRefundParamsEntity";
import { userRefundRepositoryIns } from "@app/repositories/UserRefundRepository";
import ArrayHelper from "@app/helpers/ArrayHelper";
import { SmartphoneComplainFieldIdEnum } from "@app/enums/SmartphoneComplainFieldIdEnum";
import { complaintServiceIns } from "../complaints/ComplaintRepositoryService";
import { htmlToPDFConverterIns } from "@app/services/HTMLToPDFConverter";
import { ComplaintDetails } from "@app/models/ComplaintDetails";
import { complaintDetailsRepositoryIns } from "@app/repositories/ComplaintDetailsRepository";
import { threadId } from "worker_threads";
import { UtilsHelper } from "@app/helpers/UtilsHelper";
import { complaintRepositoryIns } from "@app/repositories/ComplaintRepository";
import { fileReaderServiceIns } from "@app/services/FileReaderService";
import { nodeMailerServiceIns } from "@app/services/NodeMailerService";
import config from "config";

export class UserPlanRepositoryService extends BaseRepositoryService {
    /**
     *
     */
    constructor() {
        super();
    }

    public paytmCallback = async (methodParamEntity: MethodParamEntity) => {
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.updatePayment, callableFunctionParams: methodParamEntity.topMethodParam, resultToBeReturnedAsFinalResult: true }).setMethod({ callableFunction: this.isPaymentSucces }).setMethod({ callableFunction: this.updateUserPlanStatus }).setMethod({ callableFunction: this.generateComplainReport, notBreakWhenReturnedValueNotTruthy: true }).setMethod({ callableFunction: this.afterPayment }).coordinate();
        return result;
    }

    public isPaymentSucces = async (methodParamEntity: MethodParamEntity) => {
        let params: PaytmCallbackResponseEntity = methodParamEntity.topMethodParam.paytm_resp;
        return params.STATUS === "TXN_SUCCESS";
    }

    public generateComplainReport = async (params: MethodParamEntity) => {
        let topParams = params.topMethodParam;
        let paytmResp = topParams.paytm_resp;
        let orderID = userPlanServiceIns.removeOrderPrefixFromOrderNo(paytmResp.ORDERID);
        let objectDetails = await complaintServiceIns.getComplaintDetailsForComplaintReport(parseInt(orderID));
        if (objectDetails) {
            await htmlToPDFConverterIns.convertComplainAnalysisReport(objectDetails, await this.afterConvertingComplaintReportToPDF.bind(null, params, objectDetails.complain_id, SmartphoneComplainFieldIdEnum.COMPLAINT_REPORT));
        }
    }

    public afterConvertingComplaintReportToPDF = async (params, complain_id, field_id, fileName) => {
        await this.addReportNameToComplainDetails(complain_id, field_id, fileName);
        // await this.afterPayment(params);
    }

    public addReportNameToComplainDetails = async (complain_id, field_id, fileName) => {
        let complaintDetails = new ComplaintDetails();
        complaintDetails.field_id = field_id;
        complaintDetails.field_val = fileName;
        complaintDetails.complaint_id = complain_id;
        await complaintDetailsRepositoryIns.create([complaintDetails]);
    }

    public updatePayment = async (methodParamEntity: MethodParamEntity) => {
        let topParams = methodParamEntity.topMethodParam.paytm_resp;
        topParams.orderId = userPlanServiceIns.removeOrderPrefixFromOrderNo(topParams.ORDERID);
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.updatePaymentStatus, callableFunctionParams: topParams, resultToBeReturnedAsFinalResult: true }).setMethod({ callableFunction: this.createPaymentDetails }).coordinate();
        return result;
    }

    public updatePaymentStatus = async (methodParamEntity: MethodParamEntity) => {
        let paytmResponse = methodParamEntity.topMethodParam;
        let userPayment: UpdateUserPaymentStatusParamsEntity = { paymentStatus: paytmResponse.STATUS === "TXN_SUCCESS" ? "completed" : "failed", orderId: paytmResponse.orderId };
        let result = await userPaymentRepositoryIns.updateUserPaymentStatus(userPayment);
        if (result[0] !== 1) {
            throw new UpdateUserPaymentStatusError();
        }
        return true;
    }

    /**
         * 
         * @param methodParamEntity 
         */
    public createPaymentDetails = async (methodParamEntity: MethodParamEntity) => {
        let userPaymentDetails = new UserPaymentDetails();
        let paytmResp = methodParamEntity.topMethodParam;
        userPaymentDetails.id = paytmResp.orderId;
        userPaymentDetails.gateway_response = JSON.stringify(paytmResp);
        let result = await userPaymentDetailsRepositoryIns.create(userPaymentDetails);
        return result;
    }

    public updateUserPlanStatus = async (methodParamEntity: MethodParamEntity) => {
        let params: PaytmCallbackResponseEntity = methodParamEntity.topMethodParam.paytm_resp;
        let result = false
        // if (params.STATUS === "TXN_SUCCESS") {
        result = await this.getMethodCoordinator().setMethod({ callableFunction: this.getUserPlanDetailsByUserPaymentId, callableFunctionParams: params, storeResultAs: StoreResultAs.GET_USER_PLAN_DETAILS_BY_USER_PAYMENT_ID }).setMethod({ callableFunction: this.markUserPlanStatusSuccess }).setMethod({ callableFunction: this.markPickupDeliverySuccess }).coordinate();
        return result;
        // }
        // return false;
    }

    public markUserPlanStatusSuccess = async (methodParamEntity: MethodParamEntity) => {
        let params: UserPlan = methodParamEntity.methodReturnedValContainer[StoreResultAs.GET_USER_PLAN_DETAILS_BY_USER_PAYMENT_ID];
        let result = await userPlanRepositoryIns.updateUserPlanStatus({ id: params.id, status: "success" });
        return result;
    }

    public markPickupDeliverySuccess = async (methodParamEntity: MethodParamEntity) => {
        let params: UserPlan = methodParamEntity.methodReturnedValContainer[StoreResultAs.GET_USER_PLAN_DETAILS_BY_USER_PAYMENT_ID];
        let result = await pickupDeliveyRepositoryIns.markPickupDeliverySuccess(params.id);
        return result;
    }

    public getUserPlanDetailsByUserPaymentId = async (methodParamEntity: MethodParamEntity) => {
        let params: PaytmCallbackResponseEntity = methodParamEntity.topMethodParam;
        let orderId = userPlanServiceIns.removeOrderPrefixFromOrderNo(params.ORDERID);
        let userPlanStatusByUserPaymentId = userPlanRepositoryIns.getUserPlanStatusByUserPaymentId(new GetUserPlanStatusByUserPaymentIdParamsEntity(parseInt(orderId)));
        return userPlanStatusByUserPaymentId;
    }

    public afterPayment = async (methodParamEntity: MethodParamEntity) => {
        let paytmResp = methodParamEntity.topMethodParam.paytm_resp;
        afterPaytmCallbackEventEmitterIns.emit(EventEmitterIdentifierEnum.AFTER_PAYTM_CALLBACK_EVENTEMITTER, paytmResp);
    }

    public getDetailsForOrderEmailTemp = async (orderId: string, fieldIds: string) => {
        let result = await userPlanRepositoryIns.getDetailsForOrderEmailTemp(orderId, fieldIds);
        return result;
    }

    public addUserPlan = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.getPlanDetails, callableFunctionParams: params, storeResultAs: StoreResultAs.PLAN_DETAILS }).setMethod({ callableFunction: this.addUserPlanDetails, storeResultAs: StoreResultAs.ADD_PLAN_RESULTS }).setMethod({ callableFunction: this.addUserPlanComponents }).coordinate();
        return result;
    }

    public addUserPlanDetails = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let addUserPlan: AddUserPlanParamEntity = { planId: params.plan_id, complainId: params.complain_id };
        let result = await userPlanRepositoryIns.create(addUserPlan);
        return result;
    }

    public addUserPlanComponents = async (methodParamEntity: MethodParamEntity) => {
        let planComponentDetails = methodParamEntity.methodReturnedValContainer[StoreResultAs.PLAN_DETAILS];
        let userPlanObj = methodParamEntity.methodReturnedValContainer[StoreResultAs.ADD_PLAN_RESULTS];
        let addUserPlanComponentsParams: AddUserPlanComponentsParamsEntity = { planComponent: planComponentDetails.PlanComponents, userPlanId: userPlanObj.id };
        let result = await userPlanComponentRepositoryIns.create(addUserPlanComponentsParams);
        return userPlanObj;
    }

    public getPlanDetails = async (methodParamEntity: MethodParamEntity) => {
        let param = methodParamEntity.topMethodParam;
        let planComponentDetails: GetPlanComponentDetailsParamsEntity = new GetPlanComponentDetailsParamsEntity(param.plan_id);
        let result = await planRepositoryIns.getPlanComponentDetails(planComponentDetails);
        return result;
    }

    public makePayment = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.getUserPlanComponentPriceDetails, callableFunctionParams: params }).setMethod({ callableFunction: this.createUserPayment }).setMethod({ callableFunction: this.generatePaytmTxnToken }).setMethod({ callableFunction: this.updateUserPayment }).coordinate();
        return result;
    }

    public getUserPlanComponentPriceDetails = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let getUserPlanComponentDetailsParams: GetUserPlanComponentDetailsParamsEntity = new GetUserPlanComponentDetailsParamsEntity(params.user_plan_id);
        let result = await userPlanRepositoryIns.getUserPlanComponentPriceDetails(getUserPlanComponentDetailsParams);
        return result;
    }

    public createUserPayment = async (methodParamEntity: MethodParamEntity) => {
        let userPlanComponentPriceDetails = methodParamEntity.lastInvokedMethodParam;
        let params = methodParamEntity.topMethodParam;
        let userPayment: UserPaymentAttributes = { grand_total: userPlanComponentPriceDetails.grand_total, sub_total: userPlanComponentPriceDetails.sub_total, tax: userPlanComponentPriceDetails.tax, user_plan_id: params.user_plan_id, gateway_charge: userPlanComponentPriceDetails.gateway_charge };
        let result = await userPaymentRepositoryIns.create(userPayment);
        return result;
    }

    public generatePaytmTxnToken = async (methodParamEntity: MethodParamEntity) => {
        let userPaymentObject: UserPayment = methodParamEntity.lastInvokedMethodParam;
        // let orderId = AppConstants.ORDER_ID_PREFIX + userPaymentObject.id;
        let orderId = UtilsHelper.buildOrderPrefix(userPaymentObject.id);
        let paytmTxnTokenParams = { amount: userPaymentObject.grand_total, orderId, userId: userPaymentObject.id };
        let paytmVal = await paytmServiceIns.generatePaytmTxnToken(paytmTxnTokenParams);
        paytmVal['user_payment'] = userPaymentObject;
        return paytmVal;
    }

    public updateUserPayment = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.lastInvokedMethodParam;
        let userPaymentObject: UserPayment = params.user_payment;
        userPaymentObject.paytm_checksum = params.head.signature;
        // userPaymentObject.order_no = AppConstants.ORDER_ID_PREFIX + userPaymentObject.id;
        userPaymentObject.order_no = UtilsHelper.buildOrderPrefix(userPaymentObject.id);
        userPaymentRepositoryIns.update(userPaymentObject);
        return params;
    }

    public updateUserPlan = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        // let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.getPlanDetails, callableFunctionParams: params, storeResultAs: StoreResultAs.PLAN_DETAILS }).setMethod({ callableFunction: this.addUserPlanDetails, storeResultAs: StoreResultAs.ADD_PLAN_RESULTS }).setMethod({ callableFunction: this.addUserPlanComponents }).coordinate();
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.updateUserPlanIfAny, callableFunctionParams: params, storeResultAs: StoreResultAs.ADD_PLAN_RESULTS }).setMethod({ callableFunction: this.deleteUserPlanComponents }).setMethod({ callableFunction: this.getPlanDetails, storeResultAs: StoreResultAs.PLAN_DETAILS }).setMethod({ callableFunction: this.addUserPlanComponents }).coordinate();
        return result;
    }

    public updateUserPlanIfAny = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await userPlanRepositoryIns.update({ id: params.user_plan_id, plan_id: params.plan_id });
        return { id: params.user_plan_id };
    }

    public deleteUserPlanComponents = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await userPlanComponentRepositoryIns.deleteUserPlanComponent(params.user_plan_id);
        return result;
    }

    public refundInspectionFee = async (pickupDeliveryId: number) => {
        let result = await this.getMethodCoordinator().setMethod({
            callableFunction: this.getUserPlanInspectionFeeDetailsForRefund, callableFunctionParams: pickupDeliveryId, storeResultAs: StoreResultAs.INSPECTION_FEE_DETAILS
        }).setMethod({ callableFunction: this.requestRefundFromPaytm }).setMethod({ callableFunction: this.storeRefundResponses, notBreakWhenReturnedValueNotTruthy: true }).setMethod({ callableFunction: this.sendRefundMail }).coordinate();
        return result;
    }

    public sendRefundMail = async (params: MethodParamEntity) => {
        let paytmRefundParamsEntity: PaytmRefundParamsEntity = params.methodReturnedValContainer[StoreResultAs.INSPECTION_FEE_DETAILS];
        let userdetail = await complaintRepositoryIns.getUserDetails(paytmRefundParamsEntity.complain_id);
        let details = { name: userdetail[0]['name'], base_url: UtilsHelper.getBaseURL(), refund: paytmRefundParamsEntity.amount, order_no: paytmRefundParamsEntity.orderId, email: userdetail[0]['email'] };
        fileReaderServiceIns.readEmailTemplate("Refund.html", this.sendRefundMailCallback.bind(null, details));
    }

    public sendRefundMailCallback = async (details, error, data) => {
        nodeMailerServiceIns.sendHtml(config.get("mail.from"), details.email, "Refund Email", UtilsHelper.replaceAllStr(details, data));
    }

    public getUserPlanInspectionFeeDetailsForRefund = async (params: MethodParamEntity) => {
        let pickupDeliveryId = params.topMethodParam;
        let result = await userPlanRepositoryIns.getUserPlanInspectionFeeDetailsForRefund(pickupDeliveryId);
        let paytmRefundParamsEntity = await this.extractOutInspectionFeeDetails(result);
        return paytmRefundParamsEntity;
    }

    private extractOutInspectionFeeDetails = async (userPlanInspectionFeeDetailsForRefund: UserPlan) => {
        let details: PaytmRefundParamsEntity = { orderId: null, amount: null, txnId: null, refundId: null, complain_id: null };
        if (userPlanInspectionFeeDetailsForRefund) {
            details.orderId = userPlanInspectionFeeDetailsForRefund.userPayments[0].order_no;
            details.complain_id = userPlanInspectionFeeDetailsForRefund.complain_id;
            let gatewayResponse = JSON.parse(userPlanInspectionFeeDetailsForRefund.userPayments[0].userPaymentDetails[0].gateway_response);
            details.txnId = gatewayResponse.TXNID;
            details.refundId = details.orderId;
            let inspectionFeePlanTypeId = userPlanInspectionFeeDetailsForRefund.plan['PlanComponents'][0]['id'];
            userPlanInspectionFeeDetailsForRefund['userPlanComponentAs'].forEach((item) => {
                if (item.plan_components_id === inspectionFeePlanTypeId) {
                    details.amount = item.component_price;
                }
            });
            return details;
        }
        return null;
    }

    public requestRefundFromPaytm = async (params: MethodParamEntity) => {
        let paytmRefundParamsEntity: PaytmRefundParamsEntity = params.methodReturnedValContainer[StoreResultAs.INSPECTION_FEE_DETAILS];
        paytmRefundParamsEntity.refundId = userPlanServiceIns.removeOrderPrefixFromOrderNo(paytmRefundParamsEntity.orderId);
        let result = await paytmServiceIns.generatePaytmTxnTokenForRefund(paytmRefundParamsEntity);
        return result;
    }

    public storeRefundResponses = async (params: MethodParamEntity) => {
        let paytmResponse = params.lastInvokedMethodParam;
        let inspectionFeeDetails = params.methodReturnedValContainer[StoreResultAs.INSPECTION_FEE_DETAILS];
        let orderId = userPlanServiceIns.removeOrderPrefixFromOrderNo(inspectionFeeDetails.orderId);
        await userRefundRepositoryIns.create({ gateway_response: JSON.stringify(paytmResponse), user_payment_id: parseInt(orderId) });
    }
}

export const userPlanRepositoryServiceIns = new UserPlanRepositoryService();