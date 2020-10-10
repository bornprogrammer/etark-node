import MethodParamEntity from "@app/entities/MethodParamEntity";
import UnAuthorized from "@app/errors/UnAuthorized";
import { DateHelper } from "@app/helpers/DateHelper";
import { UtilsHelper } from "@app/helpers/UtilsHelper";
import { retailCustomerDetailRepositoryIns } from "@app/repositories/RetailCustomerDetailRepository";
import { retailerRepositoryIns } from "@app/repositories/RetailerRepository";
import { BaseRepositoryService } from "@app/services/BaseRepositoryService";
import { fileReaderServiceIns } from "@app/services/FileReaderService";
import { nodeMailerServiceIns } from "@app/services/NodeMailerService";
import config from "config";

export class RetailerRepositoryService extends BaseRepositoryService {

    constructor() {
        super();
    }

    public retailerLogin = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: retailerRepositoryIns.retailerLogin, callableFunctionParams: params }).coordinate();
        if (!result) {
            throw new UnAuthorized();
        }
        return result;
    }

    public processCustomerDetails = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.addCustomerDetails, callableFunctionParams: params, resultToBeReturnedAsFinalResult: true }).setMethod({ callableFunction: this.sendEmail }).coordinate();
        if (!result) {
            throw new UnAuthorized();
        }
        return result;
    }

    public addCustomerDetails = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await retailCustomerDetailRepositoryIns.create({ customer_name: params.customer_name, bill_id: params.bill_id, contact: params.contact, email: params.email, maker_id: params.maker_id, imei: params.imei });
        return result;
    }

    public sendEmail = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let retailerDetails = await retailerRepositoryIns.getRetailerDetailById(params.retailer_id);
        fileReaderServiceIns.readEmailTemplate("coupon.html", (error, htmlStr) => {
            let htmlStrWithData = UtilsHelper.replaceAllStr({ base_url: UtilsHelper.getBaseURL(), user: params.customer_name, retail_coupon: params.bill_id, support_email: config.get("mail.from"), expire_date: DateHelper.addDayToCurDate(90) }, htmlStr);
            nodeMailerServiceIns.sendMarketing(null, params.email, "Retail Coupon", htmlStrWithData);
        })

        fileReaderServiceIns.readEmailTemplate("retailer_customer.html", (error, htmlStr) => {
            let htmlStrWithData = UtilsHelper.replaceAllStr({ base_url: UtilsHelper.getBaseURL(), user: params.customer_name, email: params.email, contact: params.contact, bill_id: params.bill_id, retailer_name: retailerDetails.retailer_name, retailer_number: retailerDetails.phone_number, imei: params.imei, expiration_time: DateHelper.addDayToCurDate(90) }, htmlStr);
            let email = "marketing@etark.in";
            // let email = "iamabornprogrammer@gmail.com";
            nodeMailerServiceIns.sendMarketing(null, email, "Retail Coupon", htmlStrWithData);
        })
    }

    public getRetailerList = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        if (params.email) {
            let result = await retailerRepositoryIns.getRetailerList(params);
            return result;
        }

    }
}

export const retailerRepositoryServiceIns = new RetailerRepositoryService();