import { BasePatchRestAPIIntegration } from "../bases/BasePatchRestAPIIntegration";
import { HttpResponseCode } from "@app/enums/HttpResponseCodes";
import { ServiceCenterActivityTypeEnum } from "@app/enums/ServiceCenterActivityTypeEnum";

export class ServiceCenterActivityIntegration extends BasePatchRestAPIIntegration {

    /**
     *
     */
    constructor() {
        super();
        this.url = "sc/activity/20/";
        this.testSuiteName = "update service center activity";
    }

    public describe = () => {

        it("should validate wrong activity type", this.validateWrongActivityType);

        it("should validate passing wrong order activity type", this.validatePassingWrongOrderActivityType);

        it("should pass order activity as right order activity type", this.passOrderAcceptedActivityType);

        // it("should pass user to confirm as right order activity type", this.passUserToConfirmActivityType);

        // it("should pass user made payment as right order activity type", this.passUserMadePaymentActivityType);

        // it("should pass ready to dispatch as right order activity type", this.passReadyToDispatchActivityType);

        // it("should pass dispatched as right order activity type", this.passDispatchedActivityType);

    }

    private validateWrongActivityType = async () => {
        let result = await this.callAPI("wrong");
        expect(result.status).toBe(HttpResponseCode.BAD_REQUEST);
        expect(result.body.message).toContain("activity_type");
    }

    private validatePassingWrongOrderActivityType = async () => {
        let result = await this.callAPI(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_DECLINED_PAYMENT);
        expect(result.status).toBe(HttpResponseCode.EXCEPTION_FAILED);
    }

    private passOrderAcceptedActivityType = async () => {
        let result = await this.callAPI(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ORDER_ACCEPTED);
        expect(result.status).toBe(HttpResponseCode.RESOURCES_CREATED);
    }

    private passUserToConfirmActivityType = async () => {
        let result = await this.callAPI(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_TO_CONFIRM);
        expect(result.status).toBe(HttpResponseCode.RESOURCES_CREATED);
    }

    private passUserMadePaymentActivityType = async () => {
        let result = await this.callAPI(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_MADE_PAYMENT);
        expect(result.status).toBe(HttpResponseCode.RESOURCES_CREATED);
    }

    private passReadyToDispatchActivityType = async () => {
        let result = await this.callAPI(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_READY_TO_DISPATCH);
        expect(result.status).toBe(HttpResponseCode.RESOURCES_CREATED);
    }

    private passDispatchedActivityType = async () => {
        let result = await this.callAPI(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_DISPATCHED);
        expect(result.status).toBe(HttpResponseCode.RESOURCES_CREATED);
    }
}

export const serviceCenterActivityIntegrationIns = () => {
    return new ServiceCenterActivityIntegration();
}

serviceCenterActivityIntegrationIns().runTest();
