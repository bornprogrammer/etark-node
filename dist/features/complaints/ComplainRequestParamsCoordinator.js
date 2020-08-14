"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplainRequestParamsCoordinator = void 0;
const RequestParamsCoordinator_1 = __importDefault(require("@app/coordinators/request-params-cordinators/RequestParamsCoordinator"));
class ComplainRequestParamsCoordinator extends RequestParamsCoordinator_1.default {
    /**
     *
     */
    constructor(req) {
        super(req);
        this.getChancesOfWinningParams = () => {
            return this.setParamFromParamsAs("id", "complaint_id").coordinate();
        };
        this.getAddCompensationParams = () => {
            return this.setParamFromParamsAs("id", "complain_id").setParamFromBody("compensation_type").coordinate();
        };
        this.getUpdateCompensationParams = () => {
            return this.setParamFromParamsAs("id", "complain_id").setParamFromParams("complain_detail_id").setParamFromBody("compensation_type").coordinate();
        };
        this.getAddComplaintsParams = () => {
            let params = this.setParamFromBody("user_id").setParamFromBody("maker_detail_id").setParamFromBody("imei_number").setParamFromBody("model_name").setParamFromBody("phone_price").setParamFromBody("purchase_mode").setParamFromBody("merchant_id").setParamFromBody("how_long_phone_owned").setParamFromBody("problem_description").setParamFromBody("is_device_fake").setParamFromBody("uploaed_invoice_copy").setParamFromBody("communicated_ecom_firm").setParamFromBody("problem_type").setParamFromBody("merchant_response").setParamFromBody("under_warranty").coordinate();
            let complainDetailParams = {
                "user_id": params.user_id, "maker_detail_id": params.maker_detail_id, complaints_details: null
            };
            delete params.user_id;
            delete params.maker_detail_id;
            complainDetailParams.complaints_details = this.mapComplaintKeyNameToID(params);
            return complainDetailParams;
        };
        this.getAddDeviceImagesParams = () => {
            let params = this.setParamFromBody("device_front_image").setParamFromBody("device_back_image").setParamFromParams("id").coordinate();
            let addDeviceImageParams = { complaint_id: params.id, complaints_details: null };
            delete params.id;
            addDeviceImageParams.complaints_details = this.mapComplaintKeyNameToID(params);
            console.log(addDeviceImageParams);
            return addDeviceImageParams;
        };
        this.mapComplaintKeyNameToID = (complaintsParams) => {
            // let object = { "user_id": complaintsParams.user_id, "maker_detail_id": complaintsParams.maker_detail_id, 
            // complaints_details: [] };
            let complaintFields = [];
            // let complaintKeyWithId = { "imei_number": 1, "model_name": 2, "phone_price": 4, "purchase_mode": 5, "merchant_id": 6, "how_long_phone_owned": 7, "under_warranty": 8, "problem_description": 9, "is_device_fake": 10, "uploaed_invoice_copy": 11, "communicated_ecom_firm": 12, "problem_type": 13, "merchant_response": 14 };
            for (const key in complaintsParams) {
                // if (key !== "user_id" && key !== "maker_detail_id") {
                // let complainDetails = { field_id: complaintKeyWithId[key], field_val: complaintsParams[key] };
                let complainDetails = this.buildComplaintFields(this.getIdForComplaintField(key), complaintsParams[key]);
                complaintFields.push(complainDetails);
                // }
            }
            return complaintFields;
        };
        this.getIdForComplaintField = (key) => {
            let complaintKeyWithId = { "imei_number": 1, "model_name": 2, "phone_price": 4, "purchase_mode": 5, "merchant_id": 6, "how_long_phone_owned": 7, "under_warranty": 8, "problem_description": 9, "is_device_fake": 10, "uploaed_invoice_copy": 11, "communicated_ecom_firm": 12, "problem_type": 13, "merchant_response": 14, "device_front_image": 15, device_back_image: 16 };
            return complaintKeyWithId[key];
        };
        this.buildComplaintFields = (fieldId, fieldVal) => {
            let complaintFields = { field_id: fieldId, field_val: fieldVal };
            // if (complaintId) {
            //     complaintFields['complaint_id'] = complaintId;
            // }
            return complaintFields;
        };
    }
    static getInstance(request) {
        return new ComplainRequestParamsCoordinator(request);
    }
}
exports.ComplainRequestParamsCoordinator = ComplainRequestParamsCoordinator;
//# sourceMappingURL=ComplainRequestParamsCoordinator.js.map