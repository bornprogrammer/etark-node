import { BasePostRestAPIIntegration } from "../bases/BasePostRestAPIIntegration";
import { HttpResponseCode } from "@app/enums/HttpResponseCodes";


export class AddDeviceDetailsIntegration extends BasePostRestAPIIntegration {

    private pickupDeliveryId: string;
    /**
     *
     */
    constructor() {
        super();
        this.pickupDeliveryId = "52";
        this.url = "sc/dispatch-details/";
        this.testSuiteName = "add device details";
    }

    protected getPostData = () => {
        return {
            "device_front_image": "font_image",
            "device_back_image": "back_image",
            "final_invoice_image": "sssss"
        }
    }

    public describe = () => {

        describe("validate fields", () => {

            it("should validate the pickup delivery id", this.validatePickupDeliveryId);

            it("should validte the device front image", this.validateDeviceFrontImage);

            it("should validte the device back image", this.validateDeviceBackImage);

            it("should validte the final invoice image", this.validateFinalInvoiceImage);

        })

        describe("passing wrong pickup delivery id", () => {

            it("pass wrong delivery id", this.passingWrongDeliveryId);

        })

        describe("test the adding device  dispatch  details", () => {
            it("add device dispatch details", this.addDeviceDispatchDetails);
        })
    }

    private validatePickupDeliveryId = async () => {
        let pickupDeliveryId = "0";
        this.postData = this.getPostData();
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST, pickupDeliveryId);
    }

    private validateDeviceFrontImage = async () => {
        this.postData = this.getPostData();
        this.postData.device_front_image = "";
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST, this.pickupDeliveryId);
    }

    private validateDeviceBackImage = async () => {
        this.postData = this.getPostData();
        this.postData.device_back_image = "";
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST, this.pickupDeliveryId);
    }

    private validateFinalInvoiceImage = async () => {
        this.postData = this.getPostData();
        this.postData.final_invoice_image = "";
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST, this.pickupDeliveryId);
    }

    private passingWrongDeliveryId = async () => {
        let result = await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST, "345667");
    }

    private addDeviceDispatchDetails = async () => {
        this.postData = this.getPostData();
        await this.callNCompareStatus(HttpResponseCode.RESOURCES_CREATED, this.pickupDeliveryId);
    }
}

export const addDeviceDetailsIntegrationIns = () => {
    return new AddDeviceDetailsIntegration();
}

addDeviceDetailsIntegrationIns().runTest();

