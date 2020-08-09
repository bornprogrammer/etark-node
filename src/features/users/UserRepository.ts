import BaseRepository from "@app/services/BaseRepository";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { UserAddress } from "@app/models/UserAddress";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { QueryTypes } from "sequelize";
import { UserPlanComponent } from "@app/models/UserPlanComponent";
import { UpdateUserPlanComponentPriceParamEntity } from "@app/repo-method-param-entities/UpdateUserPlanComponentPriceParamEntity";
import { GetServiceCenterListParamsEntity } from "@app/repo-method-param-entities/GetClosestServiceCenterDetailsParamsEntity";

export class UserRepository extends BaseRepository {

    /**
     *
     */
    constructor() {
        super();
    }
    public create(params: any) {
        throw new Error("Method not implemented.");
    }

    public addAddress = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        return await UserAddress.create({
            address: params.address,
            zip_code: params.zip_code,
            user_id: params.user_id,
            city_id: params.city_id,
            lat: params.lat,
            lon: params.long
        })
    }

    public getServiceCenterList = async (params: GetServiceCenterListParamsEntity) => {
        let result = await sequelizeConnection.connection.query(`select service_centers.lat as service_centers_lat,service_centers.lon as service_centers_long,user_address.lat as user_address_lat,user_address.lon as user_address_long,swiggy_genie_price.base_fare,swiggy_genie_price.base_km,swiggy_genie_price.per_km_above_base_km from user_address inner join service_centers on user_address.city_id = service_centers.city_id inner join maker_detail on service_centers.maker_id = maker_detail.maker_id inner join complaints on maker_detail.id = complaints.maker_detail_id inner join swiggy_genie_price on user_address.city_id = swiggy_genie_price.city_id where service_centers.status='active' and user_address.id = ${params.userAddressId} and complaints.id = ${params.complainId}`, { type: QueryTypes.SELECT });
        return result;
    }

    public getUserPlanComponentDetailsByComplaintId = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await sequelizeConnection.connection.query(`select user_plan_components.id as user_plan_component_id,plan_components.component_display_name,plan_components.component_type,plan_components.component_price
        from user_plan inner join user_plan_components on user_plan.id = user_plan_components.user_plan_id inner join plan_components on user_plan_components.plan_components_id = plan_components.id
        where user_plan.complain_id = ${params.complain_id} and user_plan.status='pending'`, {
            type: QueryTypes.SELECT
        });
        // if (!UtilsHelper.isMethodReturnedValueTruthy(result)) {
        //     throw new ServiceCenterNotFound();
        // }
        return result;
    }

    // public updatePickupNDeliveryComponent = async (methodParamEntity: MethodParamEntity) => {
    //     let userPlanComponentObj = methodParamEntity.methodParam;
    //     let pickupNDeliveryPrice = methodParamEntity.lastInvokedMethodParam;
    //     let result = await UserPlanComponent.update({
    //         component_price: pickupNDeliveryPrice
    //     }, {
    //         where: {
    //             id: userPlanComponentObj.user_plan_component_id
    //         }
    //     });
    //     return result;
    // }

    public updateUserPlanComponentPrice = async (params: UpdateUserPlanComponentPriceParamEntity) => {
        let result = await UserPlanComponent.update({
            component_price: params.componentPrice
        }, {
            where: {
                id: params.userPlanComponentId
            }
        });
        return result;
    }
}

export const userRepositoryIns = new UserRepository();
