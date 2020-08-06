import BaseService from "@app/services/BaseService";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { userRepositoryIns } from "./UserRepository";
import { StoreResultAsEnums } from "@app/enums/StoreResultAsEnums";
import { UtilsHelper } from "@app/helpers/UtilsHelper";
import { AppConstants } from "@app/constants/AppConstants";

class UserService extends BaseService {
    /**
     *
     */
    constructor() {
        super();
    }

    public addAddress = async (meth: MethodParamEntity) => {
        return await this.getMethodCoordinator().setMethod({ callableFunction: userRepositoryIns.addAddress, callableFunctionParams: meth.topMethodParam, storeResultAs: StoreResultAsEnums.ADD_ADDRESS_RESULTS }).setMethod({ callableFunction: userRepositoryIns.getServiceCenterDetails }).setMethod({ callableFunction: this.getPickupNDeliveryPrice }).coordinate();
    }

    public getPickupNDeliveryPrice = (methodParamEntity: MethodParamEntity) => {
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