
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
import { userPlanServiceIns } from "./UserPlanService";
import { UpdateUserPaymentStatusError } from "@app/errors/UpdateUserPaymentStatusError";
import { afterPaytmCallbackEventEmitterIns } from "@app/events/AfterPaytmCallbackEventEmitter";
import { EventEmitterIdentifierEnum } from "@app/enums/EventEmitterIdentifierEnum";
import { PaytmCallbackResponseEntity } from "@app/entities/PaytmCallbackResponseEntity";
import { GetUserPlanStatusByUserPaymentIdParamsEntity } from "@app/repo-method-param-entities/GetUserPlanStatusByUserPaymentIdParamsEntity";
import { UserPlan } from "@app/models/UserPlan";

export class UserPlanRepositoryService extends BaseRepositoryService {
    /**
     *
     */
    constructor() {
        super();
    }

    public paytmCallback = async (methodParamEntity: MethodParamEntity) => {
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.updatePayment, callableFunctionParams: methodParamEntity.topMethodParam, resultToBeReturnedAsFinalResult: true }).setMethod({ callableFunction: this.updateUserPlanStatus }).setMethod({ callableFunction: this.afterPayment }).coordinate();
        return result;
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
        if (params.STATUS === "TXN_SUCCESS") {
            let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.getUserPlanDetailsByUserPaymentId, callableFunctionParams: params }).setMethod({ callableFunction: this.markUserPlanStatusSuccess }).coordinate();
            return result;
        }
        return false;
    }

    public markUserPlanStatusSuccess = async (methodParamEntity: MethodParamEntity) => {
        let params: UserPlan = methodParamEntity.lastInvokedMethodParam;
        let result = await userPlanRepositoryIns.updateUserPlanStatus({ id: params.id, status: "success" });
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

    public sendEmail = async (methodParamEntity: MethodParamEntity) => {
        // let params = methodParamEntity.topMethodParam;
        // console.log("sent email");
        // let orderId = params.paytm_resp.ORDERID.replace(AppConstants.ORDER_ID_PREFIX, "");
        // let orderId = userPlanServiceIns.removeOrderPrefixFromOrderNo(params.paytm_resp.ORDERID);
        // if (params.paytm_resp.STATUS === "TXN_SUCCESS") {

        // fileReaderServiceIns.readEmailTemplate("order-detail.html", this.sendOrderEmail.bind(null, result));
        // }
        // return params;
    }

    public getDetailsForOrderEmailTemp = async (orderId: string) => {
        let result = await userPlanRepositoryIns.getDetailsForOrderEmailTemp(orderId);
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
        return result
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
        let orderId = AppConstants.ORDER_ID_PREFIX + userPaymentObject.id;
        let paytmTxnTokenParams = { amount: userPaymentObject.grand_total, orderId, userId: userPaymentObject.id };
        let paytmVal = await paytmServiceIns.generatePaytmTxnToken(paytmTxnTokenParams);
        paytmVal['user_payment'] = userPaymentObject;
        return paytmVal;
    }

    public updateUserPayment = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.lastInvokedMethodParam;
        let userPaymentObject: UserPayment = params.user_payment;
        userPaymentObject.paytm_checksum = params.head.signature;
        userPaymentObject.order_no = AppConstants.ORDER_ID_PREFIX + userPaymentObject.id;
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

}

export const userPlanRepositoryServiceIns = new UserPlanRepositoryService();