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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepositoryIns = exports.UserRepository = void 0;
const BaseRepository_1 = __importDefault(require("@app/repositories/BaseRepository"));
const UserAddress_1 = require("@app/models/UserAddress");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
const sequelize_1 = require("sequelize");
const UserPlanComponent_1 = require("@app/models/UserPlanComponent");
class UserRepository extends BaseRepository_1.default {
    /**
     *
     */
    constructor() {
        super();
        this.addAddress = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            return yield UserAddress_1.UserAddress.create({
                address: params.address,
                zip_code: params.zip_code,
                user_id: params.user_id,
                city_id: params.city_id,
                lat: params.lat,
                lon: params.long
            });
        });
        this.getServiceCenterList = (params) => __awaiter(this, void 0, void 0, function* () {
            let result = yield SequelizeConnection_1.sequelizeConnection.connection.query(`select service_centers.id as service_center_id,service_centers.lat as service_centers_lat,service_centers.lon as service_centers_long,user_address.lat as user_address_lat,user_address.lon as user_address_long,swiggy_genie_price.base_fare,swiggy_genie_price.base_km,swiggy_genie_price.per_km_above_base_km from user_address inner join service_centers on user_address.city_id = service_centers.city_id inner join service_center_detail on service_centers.id=service_center_detail.service_center_id inner join maker_detail on service_center_detail.maker_id = maker_detail.maker_id inner join complaints on maker_detail.id = complaints.maker_detail_id inner join swiggy_genie_price on user_address.city_id = swiggy_genie_price.city_id where service_centers.status='active' and service_center_detail.status='active' and user_address.id = ${params.userAddressId} and complaints.id = ${params.complainId}`, { type: sequelize_1.QueryTypes.SELECT });
            return result;
        });
        this.getUserPlanComponentDetailsByComplaintId = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let result = yield SequelizeConnection_1.sequelizeConnection.connection.query(`select plan_components.is_taxable,user_plan_components.id as user_plan_component_id,plan_components.component_display_name,plan_components.component_type,plan_components.component_price
        from user_plan inner join user_plan_components on user_plan.id = user_plan_components.user_plan_id inner join plan_components on user_plan_components.plan_components_id = plan_components.id
        where user_plan.complain_id = ${params.complain_id} and user_plan.status='pending'`, {
                type: sequelize_1.QueryTypes.SELECT
            });
            return result;
        });
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
        this.updateUserPlanComponentPrice = (params) => __awaiter(this, void 0, void 0, function* () {
            let result = yield UserPlanComponent_1.UserPlanComponent.update({
                component_price: params.componentPrice
            }, {
                where: {
                    id: params.userPlanComponentId
                }
            });
            return result;
        });
    }
    create(params) {
        throw new Error("Method not implemented.");
    }
}
exports.UserRepository = UserRepository;
exports.userRepositoryIns = new UserRepository();
//# sourceMappingURL=UserRepository.js.map