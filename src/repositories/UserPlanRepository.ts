import BaseRepository from "@app/services/BaseRepository";
import { GetUserPlanComponentDetailsParamsEntity } from "@app/repo-method-param-entities/GetUserPlanComponentDetailsParamsEntity";
import { UserPlan } from "@app/models/UserPlan";
import { UserPlanComponent } from "@app/models/UserPlanComponent";
import { AddUserPlanParamEntity } from "@app/repo-method-param-entities/AddUserPlanParamEntity";
import { PlanComponent } from "@app/models/PlanComponents";
import { PlanComponents } from "@app/enums/PlanComponents";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { QueryTypes } from "sequelize";

export class UserPlanRepository extends BaseRepository {
    /**
     *
     */
    constructor() {
        super();
    }

    public getUserPlanComponentDetails = async (params: GetUserPlanComponentDetailsParamsEntity) => {
        let result = await UserPlan.findOne({
            where: {
                id: params.userPlanId,
                status: params.userPlanStatus
            },
            include: [
                {
                    model: UserPlanComponent,
                    where: {
                        status: params.userPlanComponentStatus,
                    },
                    include: [
                        {
                            model: PlanComponent,
                            where: {
                                status: params.planComponentStatus
                            },
                            as: "planComponent"
                        }
                    ]
                }
            ]
        })
        return result;
    }

    public getUserPlanComponentPriceDetails = async (params: GetUserPlanComponentDetailsParamsEntity) => {
        let result = await this.getUserPlanComponentDetails(params);
        let userPlanComponentPriceDetails = { grand_total: 0, sub_total: 0, tax: 0 };
        result.UserPlanComponents.forEach((userPlanComponentObject: UserPlanComponent) => {
            userPlanComponentPriceDetails.grand_total += userPlanComponentObject.component_price;
            if (userPlanComponentObject.planComponent.component_type === PlanComponents.TAX) {
                userPlanComponentPriceDetails.tax = userPlanComponentObject.component_price;
            }
        });
        userPlanComponentPriceDetails.sub_total = userPlanComponentPriceDetails.grand_total - userPlanComponentPriceDetails.tax;
        return userPlanComponentPriceDetails;
    }

    public create = async (params: AddUserPlanParamEntity) => {
        let addUserPlanParams = {
            complain_id: params.complainId,
            plan_id: params.planId,
        };
        let result = await UserPlan.create(addUserPlanParams);
        return result;
    }

    public getDetailsForOrderEmailTemp = async (orderId: string) => {
        let result = await sequelizeConnection.connection.query(`select users.name,users.email,plans.plan_name
        from user_payment inner join user_plan on user_payment.user_plan_id = user_plan.id  inner join plans on user_plan.plan_id = plans.id
        inner join complaints on user_plan.complain_id = complaints.id inner join users on complaints.user_id = users.id
        where user_payment.id=${orderId}`, {
            type: QueryTypes.SELECT
        })
        return result;
    }
}

export const userPlanRepositoryIns = new UserPlanRepository();