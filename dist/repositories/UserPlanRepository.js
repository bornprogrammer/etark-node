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
exports.userPlanRepositoryIns = exports.UserPlanRepository = void 0;
const BaseRepository_1 = __importDefault(require("@app/repositories/BaseRepository"));
const UserPlan_1 = require("@app/models/UserPlan");
const UserPlanComponent_1 = require("@app/models/UserPlanComponent");
const PlanComponents_1 = require("@app/models/PlanComponents");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
const sequelize_1 = require("sequelize");
const UserPayment_1 = require("@app/models/UserPayment");
const AppConstants_1 = require("@app/constants/AppConstants");
class UserPlanRepository extends BaseRepository_1.default {
    /**
     *
     */
    constructor() {
        super();
        this.getUserPlanComponentDetails = (params) => __awaiter(this, void 0, void 0, function* () {
            let result = yield UserPlan_1.UserPlan.findOne({
                where: {
                    id: params.userPlanId,
                    status: params.userPlanStatus
                },
                include: [
                    {
                        model: UserPlanComponent_1.UserPlanComponent,
                        where: {
                            status: params.userPlanComponentStatus,
                        },
                        include: [
                            {
                                model: PlanComponents_1.PlanComponent,
                                where: {
                                    status: params.planComponentStatus
                                },
                                as: "planComponent"
                            }
                        ]
                    }
                ]
            });
            return result;
        });
        this.getUserPlanComponentPriceDetails = (params) => __awaiter(this, void 0, void 0, function* () {
            let result = yield this.getUserPlanComponentDetails(params);
            let userPlanComponentPriceDetails = { grand_total: 0, sub_total: 0, tax: 0, gateway_charges: 0 };
            let taxableAmount = 0;
            result.UserPlanComponents.forEach((userPlanComponentObject) => {
                userPlanComponentPriceDetails.sub_total += userPlanComponentObject.component_price;
                if (userPlanComponentObject.planComponent.is_taxable === 1) {
                    taxableAmount += userPlanComponentObject.component_price;
                }
            });
            userPlanComponentPriceDetails.tax = Math.round((AppConstants_1.AppConstants.CGST / 100) * taxableAmount);
            userPlanComponentPriceDetails.grand_total = userPlanComponentPriceDetails.tax + userPlanComponentPriceDetails.sub_total;
            userPlanComponentPriceDetails.gateway_charges = Math.round((AppConstants_1.AppConstants.PAYTM_GATEWAY_CHARGES / 100) * userPlanComponentPriceDetails.grand_total);
            userPlanComponentPriceDetails.grand_total += userPlanComponentPriceDetails.gateway_charges;
            return userPlanComponentPriceDetails;
        });
        this.create = (params) => __awaiter(this, void 0, void 0, function* () {
            let addUserPlanParams = {
                complain_id: params.complainId,
                plan_id: params.planId,
            };
            let result = yield UserPlan_1.UserPlan.create(addUserPlanParams);
            return result;
        });
        this.updateUserPlanStatus = (params) => __awaiter(this, void 0, void 0, function* () {
            let result = yield UserPlan_1.UserPlan.update({
                status: params.status
            }, {
                where: {
                    id: params.id,
                    status: "pending",
                }
            });
            return result;
        });
        this.getDetailsForOrderEmailTemp = (orderId) => __awaiter(this, void 0, void 0, function* () {
            let result = yield SequelizeConnection_1.sequelizeConnection.connection.query(`select plans.plan_type,user_payment.order_no,users.name,users.email,plans.plan_name
        from user_payment inner join user_plan on user_payment.user_plan_id = user_plan.id  inner join plans on user_plan.plan_id = plans.id
        inner join complaints on user_plan.complain_id = complaints.id inner join users on complaints.user_id = users.id
        where user_payment.id=${orderId} and user_plan.status='success'`, {
                type: sequelize_1.QueryTypes.SELECT
            });
            return result;
        });
        this.getUserPlanStatusByUserPaymentId = (params) => __awaiter(this, void 0, void 0, function* () {
            let result = yield UserPlan_1.UserPlan.findOne({
                include: [
                    {
                        model: UserPayment_1.UserPayment,
                        required: true,
                        where: {
                            id: params.userPaymentId,
                            payment_status: params.userPaymentStatus
                        },
                        as: "userPayments"
                    }
                ]
            });
            return result;
        });
    }
}
exports.UserPlanRepository = UserPlanRepository;
exports.userPlanRepositoryIns = new UserPlanRepository();
//# sourceMappingURL=UserPlanRepository.js.map