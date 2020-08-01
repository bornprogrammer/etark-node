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

    public getAddComplaintsParams = () => {
        let params = this.setParamFromBody("user_id").setParamFromBody("maker_detail_id").setParamFromBody("imei_number").setParamFromBody("model_name").setParamFromBody("phone_price").setParamFromBody("purchase_mode").setParamFromBody("merchant_id").setParamFromBody("how_long_phone_owned").setParamFromBody("problem_description").setParamFromBody("is_device_fake").setParamFromBody("uploaed_invoice_copy").setParamFromBody("communicated_ecom_firm").setParamFromBody("problem_type").setParamFromBody("merchant_response").setParamFromBody("under_warranty").coordinate();
        return this.mapComplaintKeyNameToID(params);
    }

    private mapComplaintKeyNameToID = (complaintsParams: any) => {
        let object = { "user_id": complaintsParams.user_id, "maker_detail_id": complaintsParams.maker_detail_id, complaints_details: [] };

        let complaintKeyWithId = { "imei_number": 1, "model_name": 2, "phone_price": 4, "purchase_mode": 5, "merchant_id": 6, "how_long_phone_owned": 7, "under_warranty": 8, "problem_description": 9, "is_device_fake": 10, "uploaed_invoice_copy": 11, "communicated_ecom_firm": 12, "problem_type": 13, "merchant_response": 14 };

        for (const key in complaintsParams) {
            if (key !== "user_id" && key !== "maker_detail_id") {
                let complainDetails = { field_id: complaintKeyWithId[key], field_val: complaintsParams[key] };
                object.complaints_details.push(complainDetails);
                // console.log(complainDetails);
            }
        }
        return object;
    }
}
