import { BasePostRestAPIIntegration } from "../bases/BasePostRestAPIIntegration";
import { HttpResponseCode } from "@app/enums/HttpResponseCodes";





export class ServiceCenterAddOrderDetailsIntegration extends BasePostRestAPIIntegration {

    /**
     *
     */
    constructor() {
        super();
        this.url = "sc/16";
        this.testSuiteName = "add service center device details order";
    }

    protected getPostData() {
        return {
            "pickup_delivery_id": "210",
            "imei_number": "ssssss",
            "device_front_image": "font_image",
            "device_back_image": "back_image",
            "phone_warranty": "non_warranty",
            "service_to_be_done": "ss",
            "invoice_total_amount": "1",
            "proforma_invoice_image": "2222",
            "due_date": "ss",
            "device_delivery_date": "ss",
            "not_warranty_reason": "this is not warranty reason"
        }
    }
    public describe = () => {
        describe("validate service center order fields", () => {

            it("validate pickup delivery id", this.validatePickupDeliveryId);

            it("validate pickup delivery id value > 0", this.validatePickupDeliveryIdValueGreaterThanZero);

            // it("validate pickup delivery id", this.validatePickupDeliveryId);

            // it("validate pickup delivery id", this.validatePickupDeliveryId);

        })
    }

    public validatePickupDeliveryId = async () => {
        this.postData = this.getPostData();
        this.postData.pickup_delivery_id = "";
        let result = await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
        expect(result.body.message).toContain("pickup_delivery_id");
    }

    public validatePickupDeliveryIdValueGreaterThanZero = async () => {
        this.postData = this.getPostData();
        this.postData.pickup_delivery_id = 0;
        let result = await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
        expect(result.body.message).toContain("pickup_delivery_id");
    }

    public validateIMEINumber = async () => {
        this.postData = this.getPostData();
        this.postData.imei_number = "";
        let result = await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
        expect(result.body.message).toContain("imei");
    }

    public validateDeviceFrontImage = async () => {
        this.postData = this.getPostData();
        this.postData.device_front_image = "";
        let result = await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
        expect(result.body.message).toContain("device_front_image");
    }

    public validateDeviceBackImage = async () => {
        this.postData = this.getPostData();
        this.postData.device_back_image = "";
        let result = await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
        expect(result.body.message).toContain("device_back_image");
    }

    public validatePhoneWarranty = async () => {
        this.postData = this.getPostData();
        this.postData.phone_warranty = "";
        let result = await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
        expect(result.body.message).toContain("phone_warranty");
    }

    public validateWrongPhoneWarrantyValue = async () => {
        this.postData = this.getPostData();
        this.postData.phone_warranty = "wrong_warannty_value";
        let result = await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
        expect(result.body.message).toContain("phone_warranty");
    }

    public validateServiceToBeDone = async () => {
        this.postData = this.getPostData();
        this.postData.service_to_be_done = "";
        let result = await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
        expect(result.body.message).toContain("service_to_be_done");
    }

    public validateInvoiceTotalAmount = async () => {
        this.postData = this.getPostData();
        this.postData.invoice_total_amount = "";
        let result = await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
        expect(result.body.message).toContain("invoice_total_amount");
    }

    public validateInvoiceTotalAmountGreaterThanZero = async () => {
        this.postData = this.getPostData();
        this.postData.invoice_total_amount = "0";
        await this.callNCompareStatusNMessageContained(HttpResponseCode.BAD_REQUEST, "invoice_total_amount");
    }

    public validateProformaInvoiceImage = async () => {
        this.postData = this.getPostData();
        this.postData.invoice_total_amount = "0";
        await this.callNCompareStatusNMessageContained(HttpResponseCode.BAD_REQUEST, "invoice_total_amount");
    }

}

export const serviceCenterAddOrderDetailsIntegrationIns = () => {
    return new ServiceCenterAddOrderDetailsIntegration();
}

serviceCenterAddOrderDetailsIntegrationIns().runTest();

