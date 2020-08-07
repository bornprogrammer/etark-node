
import BaseRepository from "@app/services/BaseRepository";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { UserPaymentDetails } from "@app/models/UserPaymentDetails";
import { UserPlan } from "@app/models/UserPlan";
import { StoreResultAs } from "@app/enums/StoreResultAs";
import { PlanComponent } from "@app/models/PlanComponents";
import { UserPlanComponent } from "@app/models/UserPlanComponent";
import { Plan } from "@app/models/Plan";

// export class UserPlanRepository extends BaseRepository {
/**
 *
 */
    // constructor() {
    //     super();
    // }

    // public paytmCallback = async (methodParamEntity: MethodParamEntity) => {
    //     let params = methodParamEntity.topMethodParam;
    //     // let userPaymentDetails = {};
    //     let result = await UserPaymentDetails.create({
    //         gateway_response: JSON.stringify(params.resp)
    //     });
    //     return result;
    // }
    // public addPlan = async (methodParamEntity: MethodParamEntity) => {
    //     let params = methodParamEntity.topMethodParam;
    //     let addUserPlanParams = {
    //         complain_id: params.complain_id,
    //         plan_id: params.plan_id,
    //     };
    //     let result = await UserPlan.create(addUserPlanParams);
    //     return result;
    // }

    // public getPlanDetails = async (methodParamEntity: MethodParamEntity) => {
    //     let params = methodParamEntity.topMethodParam;
    //     let result = await Plan.findOne({
    //         where: {
    //             id: params.plan_id,
    //         },
    //         include: {
    //             model: PlanComponents,
    //             where: {
    //                 status: 'active'
    //             },
    //             required: true
    //         }
    //     });
    //     return result;
    // }

    // public addUserPlanComponents = async (methodParamEntity: MethodParamEntity) => {
    //     let planDetails = methodParamEntity.methodReturnedValContainer[StoreResultAs.PLAN_DETAILS];
    //     let userPlanDetails = methodParamEntity.methodReturnedValContainer[StoreResultAs.ADD_PLAN_RESULTS];
    //     for (const planComponentObj of planDetails.PlanComponents) {
    //         await UserPlanComponent.create({
    //             user_plan_id: userPlanDetails.id,
    //             plan_components_id: planComponentObj.id,
    //             component_price: planComponentObj.component_price
    //         });
    //     }
    //     return userPlanDetails;
    // }
// }


// export const userPlanRepositoryIns = new UserPlanRepository();