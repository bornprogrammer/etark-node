

export class GetUserPlanStatusByUserPaymentIdParamsEntity {
    public userPaymentId: number;
    public userPaymentStatus: string[] = ['completed'];

    constructor(userPaymentId: number) {
        this.userPaymentId = userPaymentId;
    }
}