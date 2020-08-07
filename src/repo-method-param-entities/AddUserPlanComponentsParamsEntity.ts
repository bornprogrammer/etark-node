import { PlanComponent } from "@app/models/PlanComponents";


export interface AddUserPlanComponentsParamsEntity {
    userPlanId: number,
    planComponent: PlanComponent[];
}