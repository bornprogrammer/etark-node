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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepositoryServiceIns = void 0;
const UserRepository_1 = require("./UserRepository");
const StoreResultAs_1 = require("@app/enums/StoreResultAs");
const UtilsHelper_1 = require("@app/helpers/UtilsHelper");
const PlanComponents_1 = require("@app/enums/PlanComponents");
const AppConstants_1 = require("@app/constants/AppConstants");
const ComplaintRepository_1 = require("@app/repositories/ComplaintRepository");
const UserPlanService_1 = require("../user-plan/UserPlanService");
const ComplaintService_1 = require("../complaints/ComplaintService");
const ServiceCenterNotFound_1 = require("@app/errors/ServiceCenterNotFound");
const GoogleDistanceMapApiService_1 = require("@app/services/GoogleDistanceMapApiService");
const UserPlanComponentRepository_1 = require("@app/repositories/UserPlanComponentRepository");
const BaseRepositoryService_1 = require("@app/services/BaseRepositoryService");
class UserRepositoryService extends BaseRepositoryService_1.BaseRepositoryService {
    /**
     *
     */
    constructor() {
        super();
        this.addAddress = (meth) => __awaiter(this, void 0, void 0, function* () {
            return yield this.getMethodCoordinator().setMethod({ callableFunction: UserRepository_1.userRepositoryIns.addAddress, callableFunctionParams: meth.topMethodParam, storeResultAs: StoreResultAs_1.StoreResultAs.ADD_ADDRESS_RESULTS }).setMethod({ callableFunction: UserRepository_1.userRepositoryIns.getUserPlanComponentDetailsByComplaintId }).setMethod({ callableFunction: this.updateUserPlanComponentPriceDynamicallyIfAny }).coordinate();
        });
        this.updateUserPlanComponentPriceDynamicallyIfAny = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let userPlanComponentDetails = methodParamEntity.lastInvokedMethodParam;
            let topParams = methodParamEntity.topMethodParam;
            let addAddressResult = methodParamEntity.methodReturnedValContainer[StoreResultAs_1.StoreResultAs.ADD_ADDRESS_RESULTS];
            topParams.userAddressId = addAddressResult.id;
            let totalComponentPrice = 0;
            let taxableAmount = 0;
            for (const userPlanComponent of userPlanComponentDetails) {
                if (userPlanComponent.component_type === PlanComponents_1.PlanComponents.PICKUP_DELIVERY) {
                    topParams.userPlanComponentId = userPlanComponent.user_plan_component_id;
                    userPlanComponent.component_price = yield this.updateComponentPriceForPickupNDelivery(topParams);
                }
                else if (userPlanComponent.component_type === PlanComponents_1.PlanComponents.INSPECTION_CHARGE) {
                    userPlanComponent.component_price = yield this.updateInspectionFee(topParams, userPlanComponent);
                }
                if (userPlanComponent.is_taxable == "1") {
                    taxableAmount += userPlanComponent.component_price;
                }
                totalComponentPrice += userPlanComponent.component_price;
            }
            return this.updateTax(totalComponentPrice, userPlanComponentDetails, taxableAmount);
        });
        this.updateInspectionFee = (params, userPlanComponent) => __awaiter(this, void 0, void 0, function* () {
            let updateInspectionFeeParams = { complain_id: params.complain_id, user_plan_component_id: userPlanComponent.user_plan_component_id };
            let inspectionFees = yield this.getMethodCoordinator().setMethod({ callableFunction: this.getInspectionFeeComponent, callableFunctionParams: updateInspectionFeeParams, resultToBeReturnedAsFinalResult: true }).setMethod({ callableFunction: this.updateInspectionFeeComponent }).coordinate();
            return inspectionFees;
        });
        this.getInspectionFeeComponent = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let result = yield ComplaintRepository_1.complaintRepositoryIns.getInspectionFeeComponent({ complainId: params.complain_id });
            return result.makerDetail.inspection_charges;
        });
        this.updateInspectionFeeComponent = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let inspectionFee = methodParamEntity.lastInvokedMethodParam;
            let params = methodParamEntity.topMethodParam;
            let result = yield UserPlanComponentRepository_1.userPlanComponentRepositoryIns.update({ componentPrice: inspectionFee, userPlanComponentId: params.user_plan_component_id });
            return result;
        });
        this.updateComponentPriceForPickupNDelivery = (params) => __awaiter(this, void 0, void 0, function* () {
            let updatedResult = yield this.getMethodCoordinator().setMethod({ callableFunction: this.getServiceCenterList, callableFunctionParams: params }).setMethod({ callableFunction: this.getClosestServiceCenterNPickupNDeliveryPrice, storeResultAs: StoreResultAs_1.StoreResultAs.CLOSEST_SERVICE_CENTER_N_PICKUP_N_DELIVERY_PRICE, resultToBeReturnedAsFinalResult: true }).setMethod({ callableFunction: this.updatePickupNDeliveryComponent, notBreakWhenReturnedValueNotTruthy: true }).setMethod({ callableFunction: this.addPickupNDelivery }).coordinate();
            return updatedResult;
        });
        this.getServiceCenterList = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let serviceCenterList = yield UserRepository_1.userRepositoryIns.getServiceCenterList({ complainId: params.complain_id, userAddressId: params.userAddressId });
            if (!UtilsHelper_1.UtilsHelper.isMethodReturnedValueTruthy(serviceCenterList)) {
                throw new ServiceCenterNotFound_1.ServiceCenterNotFound();
            }
            return serviceCenterList;
        });
        this.updatePickupNDeliveryComponent = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let closestServiceCenterNPickupNDeliveryPrice = methodParamEntity.methodReturnedValContainer[StoreResultAs_1.StoreResultAs.CLOSEST_SERVICE_CENTER_N_PICKUP_N_DELIVERY_PRICE];
            let result = yield UserRepository_1.userRepositoryIns.updateUserPlanComponentPrice({ componentPrice: closestServiceCenterNPickupNDeliveryPrice, userPlanComponentId: params.userPlanComponentId });
        });
        this.addPickupNDelivery = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
        });
        this.updateTax = (allComponentPrice, userPlanComponentDetails, taxableAmount) => __awaiter(this, void 0, void 0, function* () {
            let object = { sub_total: allComponentPrice, gateway_charges: 0, tax: 0, total: 0, component_details: userPlanComponentDetails };
            object.tax = Math.round((AppConstants_1.AppConstants.CGST / 100) * taxableAmount);
            object.total = object.sub_total + object.tax;
            object.gateway_charges = Math.round((AppConstants_1.AppConstants.PAYTM_GATEWAY_CHARGES / 100) * object.total);
            object.total += object.gateway_charges;
            return object;
        });
        this.getClosestServiceCenterNPickupNDeliveryPrice = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let result = methodParamEntity.lastInvokedMethodParam;
            let originLetNLong = [{ lat: result[0].user_address_lat, long: result[0].user_address_long }];
            let destLetNLong = [];
            result.forEach(item => {
                destLetNLong.push({ lat: item.service_centers_lat, long: item.service_centers_long });
            });
            let minDistanceResp = yield GoogleDistanceMapApiService_1.googleDistanceMapApiServiceIns.getMinDistanceForServiceCenter(originLetNLong, destLetNLong);
            let minDistance = parseFloat(minDistanceResp.distanceKM.toFixed(2));
            let serviceCenterObj = result[minDistanceResp.minDestIndex];
            let price = serviceCenterObj.base_fare + AppConstants_1.AppConstants.DELIVERY_PRICE_MARGIN;
            if (minDistance > serviceCenterObj.base_km) {
                let remainingDist = minDistance - serviceCenterObj.base_km;
                price += remainingDist * serviceCenterObj.per_km_above_base_km;
            }
            return Math.round(price);
        });
        this.getSuccessPageDetail = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            const params = methodParamEntity.topMethodParam;
            let orderId = parseInt(UserPlanService_1.userPlanServiceIns.removeOrderPrefixFromOrderNo(params.order_id));
            let result = yield ComplaintRepository_1.complaintRepositoryIns.getSuccessPageDetails(orderId, params.user_id);
            let successPageInfo = null;
            if (result) {
                successPageInfo = { created_at: "", imei_number: "", order_no: "", isDownloadReportToBeShown: false };
                successPageInfo.created_at = result.userPlan.userPayments[0]['createdAt'];
                successPageInfo.order_no = result.userPlan.userPayments[0]['order_no'];
                successPageInfo.imei_number = ComplaintService_1.complaintServiceIns.getIMEIFieldValue(result.complainDetails);
                successPageInfo.isDownloadReportToBeShown = result.userPlan.plan.plan_type === PlanComponents_1.PlanComponents.PICKUP_DELIVERY;
            }
            return successPageInfo;
        });
    }
}
exports.userRepositoryServiceIns = new UserRepositoryService();
//# sourceMappingURL=UserRepositoryService.js.map