import BaseRepository from "@app/services/BaseRepository";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { UserAddress } from "@app/models/UserAddress";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { QueryTypes } from "sequelize";
import { StoreResultAsEnums } from "@app/enums/StoreResultAsEnums";

export class UserRepository extends BaseRepository {
    /**
     *
     */
    constructor() {
        super();
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

    public getServiceCenterDetails = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let usrAddressDetails = methodParamEntity.methodReturnedValContainer[StoreResultAsEnums.ADD_ADDRESS_RESULTS];
        let result = await sequelizeConnection.connection.query(`select service_centers.lat as service_centers_lat,service_centers.lon as service_centers_long,user_address.lat as user_address_lat,user_address.lon as user_address_long,swiggy_genie_price.base_fare,swiggy_genie_price.base_km,swiggy_genie_price.per_km_above_base_km from user_address inner join service_centers on user_address.city_id = service_centers.city_id inner join maker_detail on service_centers.maker_id = maker_detail.maker_id inner join complaints on maker_detail.id = complaints.maker_detail_id inner join swiggy_genie_price on user_address.city_id = swiggy_genie_price.city_id where user_address.id = ${usrAddressDetails.id} and complaints.id = ${params.complain_id}`, { type: QueryTypes.SELECT });
        return result;
    }

    public getUserPlanDetailsByComplaintId = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = Use
    }
}

export const userRepositoryIns = new UserRepository();