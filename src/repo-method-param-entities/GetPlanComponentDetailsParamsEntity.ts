
export class GetPlanComponentDetailsParamsEntity {
    planId: number;
    // planStatus: string[] = ['active'];
    planComponentStatus?: string[] = ['active'];

    constructor(planId: number) {
        this.planId = planId;
    }
}