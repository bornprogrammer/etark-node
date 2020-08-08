import BaseService from "@app/services/BaseService";
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
import { UserPaymentDetailsRepository, userPaymentDetailsRepositoryIns } from "@app/repositories/UserPaymentDetailsRepository";
import { UserPaymentDetails } from "@app/models/UserPaymentDetails";
import { fileReaderServiceIns } from "@app/services/FileReaderService";
import { nodeMailerServiceIns } from "@app/services/NodeMailerService";
import { UtilsHelper } from "@app/helpers/UtilsHelper";

export class UserPlanService extends BaseService {
    /**
     *
     */
    constructor() {
        super();
    }

    public paytmCallback = async (methodParamEntity: MethodParamEntity) => {
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.isPaytmCheckSumValid, callableFunctionParams: methodParamEntity.topMethodParam }).setMethod({ callableFunction: this.updatePayment }).setMethod({ callableFunction: this.sendEmail }).coordinate();
        return result;
    }

    public sendEmail = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let orderId = params.paytm_resp.ORDERID.replace(AppConstants.ORDER_ID_PREFIX, "");
        if (params.paytm_resp.STATUS === "TXN_SUCCESS") {
            let result = await userPlanRepositoryIns.getDetailsForOrderEmailTemp(orderId);
            fileReaderServiceIns.readEmailTemplate("order-detail.html", this.sendOrderEmail.bind(null, result));
        }
        return params;
    }

    public sendOrderEmail = (orderDetail, error, data) => {
        let orderDetailObj = orderDetail[0];
        nodeMailerServiceIns.sendHtml("service@etark.in", "iamabornprogrammer@gmail.com", "Order email", UtilsHelper.replaceAllStr(orderDetailObj, data));
    }


    public isPaytmCheckSumValid = (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let isPaytmCheckSumValid = paytmServiceIns.isPaytmCheckSumValid(params.paytm_resp);
        return { isPaytmCheckSumValid };
    }

    public updatePayment = async (methodParamEntity: MethodParamEntity) => {
        let topParams = methodParamEntity.topMethodParam.paytm_resp;
        let isPaytmCheckSumValid = methodParamEntity.lastInvokedMethodParam;
        let userPayment: UpdateUserPaymentStatusParamsEntity = { paymentStatus: topParams.STATUS === "TXN_SUCCESS" ? "completed" : "failed", checksum: topParams.CHECKSUMHASH, orderNo: topParams.ORDERID };
        await userPaymentRepositoryIns.updateUserPaymentStatus(userPayment);
        let userPaymentDetails = new UserPaymentDetails();
        userPaymentDetails.id = topParams.ORDERID.replace(AppConstants.ORDER_ID_PREFIX, "");
        userPaymentDetails.gateway_response = JSON.stringify(topParams);
        await userPaymentDetailsRepositoryIns.create(userPaymentDetails);
        return topParams;
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
        let userPayment: UserPaymentAttributes = { grand_total: userPlanComponentPriceDetails.grand_total, sub_total: userPlanComponentPriceDetails.sub_total, tax: userPlanComponentPriceDetails.tax, user_plan_id: params.user_plan_id };
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
}

export const userPlanServiceIns = new UserPlanService();