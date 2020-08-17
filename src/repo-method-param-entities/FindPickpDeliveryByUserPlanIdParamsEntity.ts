

export class FindPickpDeliveryByUserPlanIdParamsEntity {
    userPlanId: number;
    status: string[];
    /**
     *
     */
    constructor(userPlanId: number) {
        this.userPlanId = userPlanId;
        this.status = ['pending'];
    }
}