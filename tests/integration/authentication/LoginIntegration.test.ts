import { BasePostRestAPIIntegration } from "../bases/BasePostRestAPIIntegration";
import { HttpResponseCode } from "@app/enums/HttpResponseCodes";

export class LoginIntegration extends BasePostRestAPIIntegration {

    /**
     *
     */
    constructor() {
        super();
        this.url = "auth/login";
        this.postData = this.getLoginParams();
        this.testSuiteName = "test login";
    }

    public getLoginParams = () => {
        return {
            mobile_number: "8250778560",
            password: "etark2020"
        }
    }

    public describe = () => {
        it("test invalid mobile number", this.testInvalidMobileNumber);

        it("test invalid mobile number length", this.testInvalidMobileNumberLength);

        it("test invalid mobile number length", this.testInvalidMobileNumberLength);

        it("test unregistered mobile number", this.testUnRegisteredMobileNumberLength);

        it("test empty password", this.testEmptyPassword);

        it("test wrong password", this.testWrongPassword);

        it("test valid login", this.testValidLogin);
    }

    public testInvalidMobileNumber = async () => {
        this.postData = this.getLoginParams();
        this.postData.mobile_number = "";
        let result = await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST)
        expect(result.body.message).toContain("mobile_number");
    }

    public testInvalidMobileNumberLength = async () => {
        this.postData = this.getLoginParams();
        this.postData.mobile_number = "09946584";
        let result = await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
        expect(result.body.message).toContain("mobile_number");
    }

    public testUnRegisteredMobileNumberLength = async () => {
        this.postData = this.getLoginParams();
        this.postData.mobile_number = "6677994455";
        let result = await this.callNCompareStatus(HttpResponseCode.UNAUTHORIZED);
    }

    public testEmptyPassword = async () => {
        this.postData = this.getLoginParams();
        this.postData.password = "";
        let result = await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
    }

    public testWrongPassword = async () => {
        this.postData = this.getLoginParams();
        this.postData.password = "password";
        let result = await this.callNCompareStatus(HttpResponseCode.UNAUTHORIZED);
    }

    public testValidLogin = async () => {
        this.postData = this.getLoginParams();

        let result = await this.callNCompareStatus(HttpResponseCode.RESOURCES_CREATED);
    }
}


export const loginIntegrationIns = () => {
    return new LoginIntegration();
}
loginIntegrationIns().runTest();