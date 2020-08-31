import { BasePostRestAPIIntegration } from "../bases/BasePostRestAPIIntegration";
import { HttpResponseCode } from "@app/enums/HttpResponseCodes";

export class ForgotPasswordIntegration extends BasePostRestAPIIntegration {

    /**
     *
     */
    constructor() {
        super();
        this.url = "auth/forgot-password";
    }


    protected getPostData() {
        return {
            email: "test1@test.com"
        }
    }
    public describe = () => {

        describe("validate fields", () => {
            it("validate empty email field", this.validateEmptyEmailFields);
            it("validate min email field length", this.validateMinEmailFieldsLen);
        })

        describe("validate wrong email", () => {
            it("validate wrong email field", this.validateWrongEmailField);
        })


        describe("validate right email", () => {
            it("validate wrong email field", this.validateRightEmailField);
        })

    }

    private validateEmptyEmailFields = async () => {
        this.setPostFieldEmpty("email");
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
    }

    private validateMinEmailFieldsLen = async () => {
        this.setPostFieldLengthOne("email");
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
    }

    private validateWrongEmailField = async () => {
        this.setPostFieldWrongVal("email", "ssss@sss.com");
        await this.callNCompareStatus(HttpResponseCode.UNAUTHORIZED);
    }

    private validateRightEmailField = async () => {
        this.resetPostFieldToOriginal();
        await this.callNCompareStatus(HttpResponseCode.RESOURCES_CREATED);
    }
}


export const forgotPasswordIntegrationIns = () => {
    return new ForgotPasswordIntegration();
}

forgotPasswordIntegrationIns().runTest();