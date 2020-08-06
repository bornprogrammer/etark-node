import BaseService from "@app/services/BaseService";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { userRepositoryIns } from "./UserRepository";
import { StoreResultAs } from "@app/enums/StoreResultAs";
import { UtilsHelper } from "@app/helpers/UtilsHelper";
import { AppConstants } from "@app/constants/AppConstants";
import { PlanComponents } from "@app/enums/PlanComponents";

class UserService extends BaseService {
    /**
     *
     */
    constructor() {
        super();
    }

    public addAddress = async (meth: MethodParamEntity) => {
        return await this.getMethodCoordinator().setMethod({ callableFunction: userRepositoryIns.addAddress, callableFunctionParams: meth.topMethodParam, storeResultAs: StoreResultAs.ADD_ADDRESS_RESULTS }).setMethod({ callableFunction: userRepositoryIns.getUserPlanComponentDetailsByComplaintId }).setMethod({ callableFunction: this.filterUserPlanComponentForPriceToBeUpdatedDynamically }).coordinate();
    }

    public filterUserPlanComponentForPriceToBeUpdatedDynamically = async (methodParamEntity: MethodParamEntity) => {
        let userPlanComponentDetails = methodParamEntity.lastInvokedMethodParam;
        let topParams = methodParamEntity.topMethodParam;
        let addAddressResult = methodParamEntity.methodReturnedValContainer[StoreResultAs.ADD_ADDRESS_RESULTS];
        topParams.user_address_id = addAddressResult.id;
        for (const userPlanComponent of userPlanComponentDetails) {
            if (userPlanComponent.component_type === PlanComponents.PICKUP_DELIVERY) {
                let updatedResult = await this.getMethodCoordinator().setMethod({ callableFunction: userRepositoryIns.getServiceCenterDetails, callableFunctionParams: topParams }).setMethod({ callableFunction: this.getClosestServiceCenterNPickupNDeliveryPrice, storeResultAs: StoreResultAs.CLOSEST_SERVICE_CENTER_N_PICKUP_N_DELIVERY_PRICE }).setMethod({ callableFunction: userRepositoryIns.updatePickupNDeliveryComponent, callableFunctionParams: { user_plan_component_id: userPlanComponent.user_plan_component_id } }).coordinate();
                userPlanComponent.component_price = updatedResult.component_price;
            }
        }
        return userPlanComponentDetails;
    }

    public getClosestServiceCenterNPickupNDeliveryPrice = (methodParamEntity: MethodParamEntity) => {
        let result = methodParamEntity.lastInvokedMethodParam;
        let distance = 3000;
        let serviceCenterObj = null;
        result.forEach(item => {
            let distanceFromLatLonInKm = UtilsHelper.getDistanceFromLatLonInKm(item.service_centers_lat, item.service_centers_long, item.user_address_lat, item.user_address_long);
            if (distanceFromLatLonInKm < distance) {
                distance = distanceFromLatLonInKm;
                serviceCenterObj = item;
            }
        });
        let price = (serviceCenterObj.base_fare * serviceCenterObj.base_km) + AppConstants.DELIVERY_PRICE_MARGIN;
        let remainingDist = distance - serviceCenterObj.base_km;
        if (remainingDist > 0) {
            price += remainingDist * serviceCenterObj.per_km_above_base_km
        }
        return Math.round(price);
    }
}

export const userServiceIns = new UserService();