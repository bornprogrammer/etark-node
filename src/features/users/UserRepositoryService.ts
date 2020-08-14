import MethodParamEntity from "@app/entities/MethodParamEntity";
import { userRepositoryIns } from "./UserRepository";
import { StoreResultAs } from "@app/enums/StoreResultAs";
import { UtilsHelper } from "@app/helpers/UtilsHelper";
import { PlanComponents } from "@app/enums/PlanComponents";
import { AppConstants } from "@app/constants/AppConstants";
import { complaintRepositoryIns } from "@app/repositories/ComplaintRepository";
import { userPlanServiceIns } from "../user-plan/UserPlanService";
import { complaintServiceIns } from "../complaints/ComplaintService";
import { GoogleDistanceMapApiEntity } from "@app/entities/GoogleDistanceMapApiEntity";
import { ServiceCenterNotFound } from "@app/errors/ServiceCenterNotFound";
import { googleDistanceMapApiServiceIns } from "@app/services/GoogleDistanceMapApiService";
import { userPlanComponentRepositoryIns } from "@app/repositories/UserPlanComponentRepository";
import { BaseRepositoryService } from "@app/services/BaseRepositoryService";

class UserRepositoryService extends BaseRepositoryService {
    /**
     *
     */
    constructor() {
        super();
    }

    public addAddress = async (meth: MethodParamEntity) => {
        return await this.getMethodCoordinator().setMethod({ callableFunction: userRepositoryIns.addAddress, callableFunctionParams: meth.topMethodParam, storeResultAs: StoreResultAs.ADD_ADDRESS_RESULTS }).setMethod({ callableFunction: userRepositoryIns.getUserPlanComponentDetailsByComplaintId }).setMethod({ callableFunction: this.updateUserPlanComponentPriceDynamicallyIfAny }).coordinate();
    }

    public updateUserPlanComponentPriceDynamicallyIfAny = async (methodParamEntity: MethodParamEntity) => {
        let userPlanComponentDetails = methodParamEntity.lastInvokedMethodParam;
        let topParams = methodParamEntity.topMethodParam;
        let addAddressResult = methodParamEntity.methodReturnedValContainer[StoreResultAs.ADD_ADDRESS_RESULTS];
        topParams.userAddressId = addAddressResult.id;
        let totalComponentPrice = 0;
        let taxableAmount = 0;
        for (const userPlanComponent of userPlanComponentDetails) {
            if (userPlanComponent.component_type === PlanComponents.PICKUP_DELIVERY) {
                topParams.userPlanComponentId = userPlanComponent.user_plan_component_id;
                userPlanComponent.component_price = await this.updateComponentPriceForPickupNDelivery(topParams);
            } else if (userPlanComponent.component_type === PlanComponents.INSPECTION_CHARGE) {
                userPlanComponent.component_price = await this.updateInspectionFee(topParams, userPlanComponent);
            }
            if (userPlanComponent.is_taxable == "1") {
                taxableAmount += userPlanComponent.component_price;
            }
            totalComponentPrice += userPlanComponent.component_price;
        }
        return this.updateTax(totalComponentPrice, userPlanComponentDetails, taxableAmount);
    }

    public updateInspectionFee = async (params: any, userPlanComponent: any) => {
        let updateInspectionFeeParams = { complain_id: params.complain_id, user_plan_component_id: userPlanComponent.user_plan_component_id };
        let inspectionFees = await this.getMethodCoordinator().setMethod({ callableFunction: this.getInspectionFeeComponent, callableFunctionParams: updateInspectionFeeParams, resultToBeReturnedAsFinalResult: true }).setMethod({ callableFunction: this.updateInspectionFeeComponent }).coordinate();
        return inspectionFees;
    }

    public getInspectionFeeComponent = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await complaintRepositoryIns.getInspectionFeeComponent({ complainId: params.complain_id });
        return result.makerDetail.inspection_charges;
    }

    public updateInspectionFeeComponent = async (methodParamEntity: MethodParamEntity) => {
        let inspectionFee = methodParamEntity.lastInvokedMethodParam;
        let params = methodParamEntity.topMethodParam;
        let result = await userPlanComponentRepositoryIns.update({ componentPrice: inspectionFee, userPlanComponentId: params.user_plan_component_id });
        return result;
    }

    public updateComponentPriceForPickupNDelivery = async (params: any) => {
        let updatedResult = await this.getMethodCoordinator().setMethod({ callableFunction: this.getServiceCenterList, callableFunctionParams: params }).setMethod({ callableFunction: this.getClosestServiceCenterNPickupNDeliveryPrice, storeResultAs: StoreResultAs.CLOSEST_SERVICE_CENTER_N_PICKUP_N_DELIVERY_PRICE, resultToBeReturnedAsFinalResult: true }).setMethod({ callableFunction: this.updatePickupNDeliveryComponent, notBreakWhenReturnedValueNotTruthy: true }).setMethod({ callableFunction: this.addPickupNDelivery }).coordinate();
        return updatedResult;
    }

    public getServiceCenterList = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let serviceCenterList = await userRepositoryIns.getServiceCenterList({ complainId: params.complain_id, userAddressId: params.userAddressId });
        if (!UtilsHelper.isMethodReturnedValueTruthy(serviceCenterList)) {
            throw new ServiceCenterNotFound();
        }
        return serviceCenterList;
    }

    public updatePickupNDeliveryComponent = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let closestServiceCenterNPickupNDeliveryPrice = methodParamEntity.methodReturnedValContainer[StoreResultAs.CLOSEST_SERVICE_CENTER_N_PICKUP_N_DELIVERY_PRICE];
        let result = await userRepositoryIns.updateUserPlanComponentPrice({ componentPrice: closestServiceCenterNPickupNDeliveryPrice, userPlanComponentId: params.userPlanComponentId });
    }

    public addPickupNDelivery = async (methodParamEntity: MethodParamEntity) => {

    }

    public updateTax = async (allComponentPrice: number, userPlanComponentDetails: any, taxableAmount: number) => {
        let object = { sub_total: allComponentPrice, gateway_charges: 0, tax: 0, total: 0, component_details: userPlanComponentDetails };
        object.tax = Math.round((AppConstants.CGST / 100) * taxableAmount);
        object.total = object.sub_total + object.tax;
        object.gateway_charges = Math.round((AppConstants.PAYTM_GATEWAY_CHARGES / 100) * object.total);
        object.total += object.gateway_charges;
        return object;
    }

    public getClosestServiceCenterNPickupNDeliveryPrice = async (methodParamEntity: MethodParamEntity) => {
        let result = methodParamEntity.lastInvokedMethodParam;
        let originLetNLong: GoogleDistanceMapApiEntity[] = [{ lat: result[0].user_address_lat, long: result[0].user_address_long }];
        let destLetNLong: GoogleDistanceMapApiEntity[] = [];
        result.forEach(item => {
            destLetNLong.push({ lat: item.service_centers_lat, long: item.service_centers_long });
        });
        let minDistanceResp = await googleDistanceMapApiServiceIns.getMinDistanceForServiceCenter(originLetNLong, destLetNLong);
        let minDistance = parseFloat(minDistanceResp.distanceKM.toFixed(2));
        let serviceCenterObj = result[minDistanceResp.minDestIndex];
        let price = serviceCenterObj.base_fare + AppConstants.DELIVERY_PRICE_MARGIN;
        if (minDistance > serviceCenterObj.base_km) {
            let remainingDist = minDistance - serviceCenterObj.base_km;
            price += remainingDist * serviceCenterObj.per_km_above_base_km;
        }
        return Math.round(price);
    }

    public getSuccessPageDetail = async (methodParamEntity: MethodParamEntity) => {
        const params = methodParamEntity.topMethodParam;
        let orderId = parseInt(userPlanServiceIns.removeOrderPrefixFromOrderNo(params.order_id));
        let result = await complaintRepositoryIns.getSuccessPageDetails(orderId, params.user_id);
        let successPageInfo = null;
        if (result) {
            successPageInfo = { created_at: "", imei_number: "", order_no: "", isDownloadReportToBeShown: false }
            successPageInfo.created_at = result.userPlan.userPayments[0]['createdAt'];
            successPageInfo.order_no = result.userPlan.userPayments[0]['order_no'];
            successPageInfo.imei_number = complaintServiceIns.getIMEIFieldValue(result.complainDetails);
            successPageInfo.isDownloadReportToBeShown = result.userPlan.plan.plan_type === PlanComponents.PICKUP_DELIVERY;
        }
        return successPageInfo;
    }

}

export const userRepositoryServiceIns = new UserRepositoryService();