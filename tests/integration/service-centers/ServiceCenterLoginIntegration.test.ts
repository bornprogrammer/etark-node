import { BasePostRestAPIIntegration } from "../bases/BasePostRestAPIIntegration";
import { HttpResponseCode } from "@app/enums/HttpResponseCodes";
import { timingSafeEqual } from "crypto";



export class ServiceCenterLoginIntegration extends BasePostRestAPIIntegration {

    /**
     *
     */
    constructor() {
        super();
        this.url = "sc/auth/login";
    }

    protected getPostData() {
        return {
            "email": "test2@test.com",
            "password": "123456"
        }
    }

    public describe = () => {

        describe("validate fields", () => {
            it("validate empty email fields", this.validateEmptyEmailField);
            it("validate email fields min length", this.validateEmailFieldMinLength);
            it("validate empty password fields", this.validateEmptyPasswordField);
            it("validate min password fields", this.validateMinPasswordField);
            it("validate max password fields", this.validateMaxPasswordField);
        })

        describe("validate wrong credentials", () => {
            it("validate wrong email field", this.validateWrongEmailField);
            it("validate wrong password field", this.validateWrongPasswordField);
        })

        describe("valiate right credentials", () => {
            it("right ", this.validateRightCredentials);
        })
    }

    private validateEmptyEmailField = async () => {
        this.setPostFieldEmpty("email");
        let result = await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
        return result;
    }

    private validateEmailFieldMinLength = async () => {
        this.setPostFieldLengthOne("email");
        let result = await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
        return result;
    }

    private validateEmptyPasswordField = async () => {
        this.setPostFieldEmpty("password");
        let result = await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
        return result;
    }

    private validateMinPasswordField = async () => {
        this.setPostFieldLengthOne("password");
        let result = await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
        return result;
    }

    private validateMaxPasswordField = async () => {
        this.setPostFieldWrongVal("password", "passwordpasswordpasswordpassword");
        let result = await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
        return result;
    }

    private validateWrongEmailField = async () => {
        this.setPostFieldWrongVal("email", "testtest@test.com");
        let result = await this.callNCompareStatus(HttpResponseCode.UNAUTHORIZED);
        return result;
    }

    private validateWrongPasswordField = async () => {
        this.setPostFieldWrongVal("password", "1234569999999");
        let result = await this.callNCompareStatus(HttpResponseCode.UNAUTHORIZED);
        return result;
    }

    private validateRightCredentials = async () => {
        this.resetPostFieldToOriginal();
        let result = await this.callNCompareStatus(HttpResponseCode.RESOURCES_CREATED);
        return result;
    }
}

export const serviceCenterLoginIntegrationIns = () => {
    return new ServiceCenterLoginIntegration();
}

serviceCenterLoginIntegrationIns().runTest();