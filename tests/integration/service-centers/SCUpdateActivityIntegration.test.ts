import { BasePatchRestAPIIntegration } from "../bases/BasePatchRestAPIIntegration";
import { HttpResponseCode } from "@app/enums/HttpResponseCodes";
import { ServiceCenterActivityTypeEnum } from "@app/enums/ServiceCenterActivityTypeEnum";

export class SCUpdateActivityIntegration extends BasePatchRestAPIIntegration {

    private pickupDeliveryId: number;
    /**
     *
     */
    constructor() {
        super();
        this.pickupDeliveryId = 55;
        this.url = "sc/activity/";
        this.testSuiteName = "update service center activity";
    }

    private setURLWithPickupDeliveryId = () => {
        let url = "sc/activity/";
        url += this.pickupDeliveryId++ + "/";
        this.url = url;
    }

    public describe = () => {

        describe("validate api flow", () => {

            beforeAll(this.setURLWithPickupDeliveryId);

            it("should validate wrong activity type", this.validateWrongActivityType);

            it("should validate passing wrong order activity type", this.validatePassingWrongOrderActivityType);

        })

        describe("user made payment flow", () => {

            it("should pass order activity as right order activity type", this.passOrderAcceptedActivityType);

            it("should pass user to confirm as right order activity type", this.passUserToConfirmActivityType);

            it("should pass user made payment as right order activity type", this.passUserMadePaymentActivityType);

            it("should pass ready to dispatch as right order activity type", this.passReadyToDispatchActivityType);

            it("should pass dispatched as right order activity type", this.passDispatchedActivityType);

        })

        describe("sc cancel flows", () => {

            beforeAll(this.setURLWithPickupDeliveryId);

            it("should pass service denied as right order activity type", this.passServiceDeniedType);
        })

        describe("sc cancel flow after inspection", () => {

            beforeAll(this.setURLWithPickupDeliveryId);

            it("should pass order activity as right order activity type", this.passOrderAcceptedActivityType);

            it("should pass service denied as right order activity type", this.passServiceDeniedTypeAfterInspection);
        })

        describe("user declined payment flow", () => {

            beforeAll(this.setURLWithPickupDeliveryId);

            it("should pass order activity as right order activity type", this.passOrderAcceptedActivityType);

            it("should pass user to confirm as right order activity type", this.passUserToConfirmActivityType);

            it("should pass user to decline payment as right order activity type", this.passUserDeclinedActivityType);
        })
    }

    private validateWrongActivityType = async () => {
        let result = await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST, "wrong");
        expect(result.body.message).toContain("activity_type");
    }

    private validatePassingWrongOrderActivityType = async () => {
        let result = await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_DECLINED_PAYMENT);
    }

    private passOrderAcceptedActivityType = async () => {
        let result = await this.callNCompareStatus(HttpResponseCode.RESOURCES_CREATED, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ORDER_ACCEPTED);
    }

    private passServiceDeniedType = async () => {
        let result = await this.callNCompareStatus(HttpResponseCode.RESOURCES_CREATED, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED);
    }

    private passServiceDeniedTypeAfterInspection = async () => {
        let result = await this.callNCompareStatus(HttpResponseCode.RESOURCES_CREATED, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED_AFTER_INSPECTION);
    }

    private passUserToConfirmActivityType = async () => {
        let result = await this.callNCompareStatus(HttpResponseCode.RESOURCES_CREATED, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_TO_CONFIRM);
    }

    private passUserDeclinedActivityType = async () => {
        let result = await this.callNCompareStatus(HttpResponseCode.RESOURCES_CREATED, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_DECLINED_PAYMENT);
    }

    private passUserMadePaymentActivityType = async () => {
        let result = await this.callNCompareStatus(HttpResponseCode.RESOURCES_CREATED, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_MADE_PAYMENT);
    }

    private passReadyToDispatchActivityType = async () => {
        let result = await this.callNCompareStatus(HttpResponseCode.RESOURCES_CREATED, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_READY_TO_DISPATCH);
    }

    private passDispatchedActivityType = async () => {
        let result = await this.callNCompareStatus(HttpResponseCode.RESOURCES_CREATED, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_DISPATCHED);
    }
}

export const scUpdateActivityIntegrationIns = () => {
    return new SCUpdateActivityIntegration();
}

scUpdateActivityIntegrationIns().runTest();
