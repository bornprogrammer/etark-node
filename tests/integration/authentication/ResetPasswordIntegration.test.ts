
import { BasePutRestAPIIntegration } from "../bases/BasePutRestAPIIntegration";
import { HttpResponseCode } from "@app/enums/HttpResponseCodes";

export class ResetPasswordIntegration extends BasePutRestAPIIntegration {

    private email: string;
    /**
     *
     */
    constructor() {
        super();
        this.email = "test1@test.com";
        this.url = "auth/reset-password/";
    }

    protected getPostData() {
        return {
            "password": "654321",
            "confirm_password": "654321"
        }
    }
    public describe = () => {

        describe("validate fields", () => {
            it("validate empty password", this.validateEmptyPassword);

            it("validate min password length", this.validateMinPasswordLength);

            it("validate empty confirm password", this.validateEmptyConfirmPassword);

            it("validate not confirm password", this.validateNotConfirmPassword);
        })

        describe("validate unrequested email", () => {
            it("validate unrequested password", this.validateUnRequestedEmail);
        })

        describe("validate right email", () => {
            it("validate reqeuested forgot password", this.validateRequestedEmail);
        })
    }

    private validateEmptyPassword = async () => {
        this.setPostFieldEmpty("password");
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST, this.email);
    }

    private validateMinPasswordLength = async () => {
        this.setPostFieldLengthOne("password");
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST, this.email);
    }

    private validateEmptyConfirmPassword = async () => {
        this.setPostFieldEmpty("confirm_password");
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST, this.email);
    }

    private validateNotConfirmPassword = async () => {
        this.setPostFieldWrongVal("password", "wrong");
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST, this.email);
    }

    private validateUnRequestedEmail = async () => {
        this.email = "test2@test.com";
        this.resetPostFieldToOriginal();
        await this.callNCompareStatus(HttpResponseCode.UNAUTHORIZED, this.email);
    }

    private validateRequestedEmail = async () => {
        this.email = "test1@test.com";
        await this.callNCompareStatus(HttpResponseCode.RESOURCES_CREATED, this.email);
    }

}

export const resetPasswordIntegrationIns = () => {
    return new ResetPasswordIntegration();
}

resetPasswordIntegrationIns().runTest();