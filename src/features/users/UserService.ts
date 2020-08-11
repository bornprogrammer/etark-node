import BaseService from "@app/services/BaseService";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { userRepositoryIns } from "./UserRepository";
import { StoreResultAs } from "@app/enums/StoreResultAs";
import { UtilsHelper } from "@app/helpers/UtilsHelper";
import { PlanComponents } from "@app/enums/PlanComponents";
import { AppConstants } from "@app/constants/AppConstants";
import { complaintRepositoryIns } from "@app/repositories/ComplaintRepository";
import { userPlanServiceIns } from "../user-plan/UserPlanService";

import { complaintServiceIns } from "../complaints/ComplaintService";

class UserService extends BaseService {
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
        let userPlanTaxComponentDetails = null;
        for (const userPlanComponent of userPlanComponentDetails) {
            if (userPlanComponent.component_type === PlanComponents.PICKUP_DELIVERY) {
                topParams.userPlanComponentId = userPlanComponent.user_plan_component_id;
                let updatedPrice = await this.updateComponentPriceForPickupNDelivery(topParams);
                userPlanComponent.component_price = updatedPrice;
            }
            if (userPlanComponent.component_type === PlanComponents.TAX) {
                userPlanTaxComponentDetails = userPlanComponent;
            }
            totalComponentPrice += userPlanComponent.component_price;
        }
        return this.updateTax(totalComponentPrice, userPlanComponentDetails, userPlanTaxComponentDetails);
    }

    public updateComponentPriceForPickupNDelivery = async (params: any) => {
        let updatedResult = await this.getMethodCoordinator().setMethod({ callableFunction: this.getServiceCenterList, callableFunctionParams: params }).setMethod({ callableFunction: this.getClosestServiceCenterNPickupNDeliveryPrice, storeResultAs: StoreResultAs.CLOSEST_SERVICE_CENTER_N_PICKUP_N_DELIVERY_PRICE }).setMethod({ callableFunction: this.updatePickupNDeliveryComponent }).coordinate();
        return updatedResult;
    }

    public getServiceCenterList = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let serviceCenterList = await userRepositoryIns.getServiceCenterList({ complainId: params.complain_id, userAddressId: params.userAddressId });
        return serviceCenterList;
    }

    public updatePickupNDeliveryComponent = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let closestServiceCenterNPickupNDeliveryPrice = methodParamEntity.methodReturnedValContainer[StoreResultAs.CLOSEST_SERVICE_CENTER_N_PICKUP_N_DELIVERY_PRICE];
        let result = userRepositoryIns.updateUserPlanComponentPrice({ componentPrice: closestServiceCenterNPickupNDeliveryPrice, userPlanComponentId: params.userPlanComponentId });
        return closestServiceCenterNPickupNDeliveryPrice;
    }

    public updateTax = async (allComponentPrice: number, userPlanComponentDetails: any, userPlanTaxComponentDetails: any) => {
        let object = { sub_total: allComponentPrice, tax: 0, total: 0, component_details: userPlanComponentDetails };
        object.tax = Math.round((18 / 100) * allComponentPrice);
        userRepositoryIns.updateUserPlanComponentPrice({ componentPrice: object.tax, userPlanComponentId: userPlanTaxComponentDetails.user_plan_component_id });
        object.total = object.sub_total + object.tax;
        return object;
    }

    public getClosestServiceCenterNPickupNDeliveryPrice = (methodParamEntity: MethodParamEntity) => {
        let result = methodParamEntity.lastInvokedMethodParam;
        let distance = 300000;
        let serviceCenterObj = null;
        result.forEach(item => {
            let distanceFromLatLonInKm = UtilsHelper.getDistanceFromLatLonInKm(item.service_centers_lat, item.service_centers_long, item.user_address_lat, item.user_address_long);
            if (distanceFromLatLonInKm < distance) {
                distance = distanceFromLatLonInKm;
                serviceCenterObj = item;
                console.log("serviceCenterObj", serviceCenterObj);
            }
        });
        distance = parseFloat(distance.toFixed(2));
        console.log("distance", distance);
        let price = serviceCenterObj.base_fare + AppConstants.DELIVERY_PRICE_MARGIN;
        let remainingDist = distance - serviceCenterObj.base_km;
        if (remainingDist > 0) {
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

export const userServiceIns = new UserService();