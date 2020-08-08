import BaseRepository from "@app/services/BaseRepository";
import { GetUserPlanComponentDetailsParamsEntity } from "@app/repo-method-param-entities/GetUserPlanComponentDetailsParamsEntity";
import { UserPlan } from "@app/models/UserPlan";
import { UserPlanComponent } from "@app/models/UserPlanComponent";
import { AddUserPlanParamEntity } from "@app/repo-method-param-entities/AddUserPlanParamEntity";
import { PlanComponent } from "@app/models/PlanComponents";
import { PlanComponents } from "@app/enums/PlanComponents";

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
        // return result;
    }

    public create = async (params: AddUserPlanParamEntity) => {
        let addUserPlanParams = {
            complain_id: params.complainId,
            plan_id: params.planId,
        };
        let result = await UserPlan.create(addUserPlanParams);
        return result;
    }
}

export const userPlanRepositoryIns = new UserPlanRepository();