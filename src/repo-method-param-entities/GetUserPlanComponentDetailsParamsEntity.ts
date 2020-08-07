import { UserPlanRequestParamCoordinator } from "@app/features/user-plan/UserPlanRequestParamCoordinator";


export class GetUserPlanComponentDetailsParamsEntity {
    userPlanId: number;
    userPlanStatus?: string[] = ["pending", "success"];
    userPlanComponentStatus?: string[] = ["active"];
    planComponentStatus?: string[] = ["active"];

    constructor(userPlanId: number) {
        this.userPlanId = userPlanId;
    }
}