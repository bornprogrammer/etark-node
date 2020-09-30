import ArrayHelper from "@app/helpers/ArrayHelper";
import { DateHelper } from "@app/helpers/DateHelper";
import { UtilsHelper } from "@app/helpers/UtilsHelper";
import { Complaint } from "@app/models/Complaint";
import BaseService from "@app/services/BaseService";



export class UserService extends BaseService {
    /**
     *
     */
    constructor() {
        super();
    }

    public convertOrderListResponse = async (orderListResponse: Complaint[]) => {
        let newOrderListResponse = null;
        if (ArrayHelper.isArrayValid(orderListResponse)) {
            newOrderListResponse = [];
            orderListResponse.forEach((complain) => {
                let complainDetails = { complainId: complain.id, maker_detail_id: complain.maker_detail_id, complainDetail: {}, serviceCenterOrderDetails: {}, deviceDispatchDetail: {}, userPaymentDetails: {}, orderDetails: {}, pickup_details: {}, serviceCenterActivityDetails: { lastActivityType: null }, userDetails: {}, userAddress: {}, bankDetails: {}, maker_name: complain.makerDetail.display_name };
                newOrderListResponse.push(complainDetails);
                complain.complainDetails.forEach((complainDet) => {
                    complainDetails.complainDetail[complainDet.field.field_name] = complainDet['field_val'];
                })
                if (complainDetails.complainDetail['invoice_report']) {
                    complainDetails.complainDetail['invoice_report'] = UtilsHelper.getBaseURLForAssetFile() + complainDetails.complainDetail['invoice_report'];
                }
                if (complainDetails.complainDetail['uploaed_invoice_copy']) {
                    complainDetails.complainDetail['uploaed_invoice_copy'] = UtilsHelper.getBaseURLForUploadedImage(complainDetails.complainDetail['uploaed_invoice_copy']);
                }
                if (ArrayHelper.isArrayValid(complain.userPlan.pickupDeliveryDetail.serviceCenterOrder)) {
                    complainDetails.serviceCenterOrderDetails = complain.userPlan.pickupDeliveryDetail.serviceCenterOrder[0];
                    complainDetails.serviceCenterOrderDetails['due_date'] = DateHelper.convertDateToUTCDate(complainDetails.serviceCenterOrderDetails['due_date']);
                    complainDetails.serviceCenterOrderDetails['device_delivery_date'] = DateHelper.convertDateToUTCDate(complainDetails.serviceCenterOrderDetails['device_delivery_date']);

                    if (ArrayHelper.isArrayValid(complainDetails.serviceCenterOrderDetails['serviceCenterPayment'])) {
                        let details = complainDetails.serviceCenterOrderDetails['serviceCenterPayment'][0].gateway_response;
                        details = JSON.parse(details);
                        complainDetails.bankDetails['BANKNAME'] = details['BANKNAME'];
                        complainDetails.bankDetails['PAYMENTMODE'] = details['PAYMENTMODE'];
                        complainDetails.bankDetails['GATEWAYNAME'] = details['GATEWAYNAME'];
                        complainDetails.bankDetails['Amount'] = details['TXNAMOUNT'];
                        complainDetails.bankDetails['TXNID'] = details['TXNID'];
                    }
                }
                if (ArrayHelper.isArrayValid(complain.userPlan.userPayments)) {
                    complainDetails.orderDetails = complain.userPlan.userPayments[0];
                }
                complainDetails.pickup_details['id'] = complain.userPlan.pickupDeliveryDetail.id;
                complainDetails.serviceCenterActivityDetails.lastActivityType = complain.userPlan.pickupDeliveryDetail.serviceCenterActivity[0].activity_type;
                complainDetails.serviceCenterActivityDetails['status'] = "Order Status";
                complainDetails.userDetails = complain.user;
                complainDetails.userAddress = complain.userPlan.pickupDeliveryDetail.userAddress;
            })
        }
        return newOrderListResponse;
    }
}


export const userServiceIns = new UserService();