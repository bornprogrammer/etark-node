import BaseRepository from "@app/repositories/BaseRepository";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { UserAddress } from "@app/models/UserAddress";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { QueryTypes } from "sequelize";
import { UserPlanComponent } from "@app/models/UserPlanComponent";
import { UpdateUserPlanComponentPriceParamEntity } from "@app/repo-method-param-entities/UpdateUserPlanComponentPriceParamEntity";
import { GetServiceCenterListParamsEntity } from "@app/repo-method-param-entities/GetClosestServiceCenterDetailsParamsEntity";
import ArrayHelper from "@app/helpers/ArrayHelper";

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
            lon: params.long,
            complain_id: params.complain_id
        })
    }

    public getServiceCenterList = async (params: GetServiceCenterListParamsEntity) => {
        let query = `select service_centers.id as service_center_id,service_centers.lat as service_centers_lat,service_centers.lon as service_centers_long,user_address.lat as user_address_lat,user_address.lon as user_address_long,swiggy_genie_price.base_fare,swiggy_genie_price.base_km,swiggy_genie_price.per_km_above_base_km from user_address inner join service_centers on user_address.city_id = service_centers.city_id inner join service_center_detail on service_centers.id=service_center_detail.service_center_id inner join maker_detail on service_center_detail.maker_id = maker_detail.maker_id inner join complaints on maker_detail.id = complaints.maker_detail_id inner join swiggy_genie_price on user_address.city_id = swiggy_genie_price.city_id where service_centers.status='active' and service_center_detail.status='active' and user_address.id = ${params.userAddressId} and complaints.id = ${params.complainId}`;
        query += params.serviceCenterIds ? ` and service_centers.id not in ${params.serviceCenterIds}` : "";
        let result = await sequelizeConnection.connection.query(query, { type: QueryTypes.SELECT });
        return result;
    }

    public getUserPlanComponentDetailsByComplaintId = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await sequelizeConnection.connection.query(`select user_plan.id as user_plan_id,plan_components.is_taxable,user_plan_components.id as user_plan_component_id,plan_components.component_display_name,plan_components.component_type,plan_components.component_price
        from user_plan inner join user_plan_components on user_plan.id = user_plan_components.user_plan_id inner join plan_components on user_plan_components.plan_components_id = plan_components.id
        where user_plan.complain_id = ${params.complain_id} and user_plan.status='pending' and user_plan_components.status='active'`, {
            type: QueryTypes.SELECT
        });
        return result;
    }

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

    public getUserAddressByOrderId = async (orderId: number) => {
        let query = `select *
        from user_payment inner join pickup_deliveries on user_payment.user_plan_id=pickup_deliveries.user_plan_id inner join user_address on pickup_deliveries.user_address_id = user_address.id
        where user_payment.payment_status='completed' and pickup_deliveries.status='success' and user_payment.id=:user_payment_id`;
        let result = await sequelizeConnection.connection.query(query, { type: QueryTypes.SELECT, replacements: { user_payment_id: orderId } });
    }
}

export const userRepositoryIns = new UserRepository();
