import RequestParamsCoordinator from "@app/coordinators/request-params-cordinators/RequestParamsCoordinator";
import { Request } from "express";

export class ComplainRequestParamsCoordinator extends RequestParamsCoordinator {
    /**
     *
     */
    constructor(req: Request) {
        super(req);
    }

    public static getInstance(request: Request): ComplainRequestParamsCoordinator {
        return new ComplainRequestParamsCoordinator(request);
    }

    public getChancesOfWinningParams = () => {
        return this.setParamFromParamsAs("id", "complaint_id").coordinate();
    }

    public getAddCompensationParams = () => {
        return this.setParamFromParamsAs("id", "complain_id").setParamFromBody("compensation_type").coordinate();
    }

    public getUpdateCompensationParams = () => {
        return this.setParamFromParamsAs("id", "complain_id").setParamFromParams("complain_detail_id").setParamFromBody("compensation_type").coordinate();
    }

    public getUpdateComplaintsParams = () => {
        let params = this.getAddComplaintsParams();
        let id = this.setParamFromParamsAs("id", 'complain_id').coordinate();
        Object.assign(params, id);
        return params;
    }

    public getAddComplaintsParams = () => {
        let params = this.setParamFromBody("user_id").setParamFromBody("maker_detail_id").setParamFromBody("imei_number").setParamFromBody("model_name").setParamFromBody("phone_price").setParamFromBody("purchase_mode").setParamFromBody("merchant_id").setParamFromBody("how_long_phone_owned").setParamFromBody("problem_description").setParamFromBody("is_device_fake").setParamFromBody("uploaed_invoice_copy").setParamFromBody("communicated_ecom_firm").setParamFromBody("problem_type").setParamFromBody("merchant_response").setParamFromBody("under_warranty").setParamFromBody('merchant_name_offline').coordinate();

        let complainDetailParams = {
            "user_id": params.user_id, "maker_detail_id": params.maker_detail_id, complaints_details: null
        };
        delete params.user_id;
        delete params.maker_detail_id;
        complainDetailParams.complaints_details = this.mapComplaintKeyNameToID(params);
        return complainDetailParams;
    }

    public getAddDeviceImagesParams = () => {
        let params = this.setParamFromBody("device_front_image").setParamFromBody("device_back_image").setParamFromParams("id").coordinate();
        let addDeviceImageParams = { complaint_id: params.id, complaints_details: null };
        delete params.id;
        addDeviceImageParams.complaints_details = this.mapComplaintKeyNameToID(params);
        console.log(addDeviceImageParams);
        return addDeviceImageParams;
    }

    private mapComplaintKeyNameToID = (complaintsParams: any) => {
        let complaintFields = [];

        for (const key in complaintsParams) {
            let complainDetails = this.buildComplaintFields(this.getIdForComplaintField(key), complaintsParams[key]);
            complaintFields.push(complainDetails);
        }
        return complaintFields;
    }

    private getIdForComplaintField = (key: string) => {
        let complaintKeyWithId = { "imei_number": 1, "model_name": 2, "phone_price": 4, "purchase_mode": 5, "merchant_id": 6, "how_long_phone_owned": 7, "under_warranty": 8, "problem_description": 9, "is_device_fake": 10, "uploaed_invoice_copy": 11, "communicated_ecom_firm": 12, "problem_type": 13, "merchant_response": 14, "device_front_image": 15, device_back_image: 16, merchant_name_offline: 20 };
        return complaintKeyWithId[key];
    }

    private buildComplaintFields = (fieldId: string, fieldVal: string) => {
        let complaintFields = { field_id: fieldId, field_val: fieldVal };
        return complaintFields;
    }
}
