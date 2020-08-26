
import request from 'supertest';
import { appInstance } from '@app/app';
import { HttpResponseCode } from '@app/enums/HttpResponseCodes';
import { UtilsHelper } from '@app/helpers/UtilsHelper';
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

describe("Sign up", () => {

    let appIns;

    beforeEach(() => { appIns = appInstance.server });

    afterEach(() => { appIns.close() });

    describe("sign up", () => {

        let unauthorizedMessage = "either username or password is wrong";

        let signUpURL = "/api/auth/";

        let getSignupParams = () => {
            let mobileNumber = UtilsHelper.generateRandomNumberBetweenRange(1122334455, 9988776655) + "";
            let obj = {
                "mobile_number": mobileNumber,
                "password": mobileNumber,
                "name": "Home",
                "email": mobileNumber + "@test.com"
            }
            return obj;
        }

        it("should validate empty mobile number", async () => {
            let loginParamsObject = getSignupParams();
            loginParamsObject.mobile_number = "";
            let result = await request(appIns).post(signUpURL).send(loginParamsObject);
            expect(result.status).toBe(HttpResponseCode.BAD_REQUEST);
            expect(result.body.message).toContain("mobile_number");
        });

        it("should validate invalid mobile number length", async () => {
            let loginParamsObject = getSignupParams();
            loginParamsObject.mobile_number = "95554045";
            let result = await request(appIns).post(signUpURL).send(loginParamsObject);
            expect(result.status).toBe(HttpResponseCode.BAD_REQUEST);
            expect(result.body.message).toContain("mobile_number");
        });

        it("should validate empty password", async () => {
            let loginParamsObject = getSignupParams();
            loginParamsObject.password = "";
            let result = await request(appIns).post(signUpURL).send(loginParamsObject);
            expect(result.body.message).toContain("password");
            expect(result.status).toBe(HttpResponseCode.BAD_REQUEST);
        });

        it("should validate password min length", async () => {
            let loginParamsObject = getSignupParams();
            loginParamsObject.password = "455";
            let result = await request(appIns).post(signUpURL).send(loginParamsObject);
            expect(result.body.message).toContain("password");
            expect(result.status).toBe(HttpResponseCode.BAD_REQUEST);
        });

        it("should validate password max length", async () => {
            let loginParamsObject = getSignupParams();
            loginParamsObject.password = "99454875199945487519";
            let result = await request(appIns).post(signUpURL).send(loginParamsObject);
            expect(result.status).toBe(HttpResponseCode.BAD_REQUEST);
            expect(result.body.message).toContain("password");
        });

        it("should validate empty name", async () => {
            let loginParamsObject = getSignupParams();
            loginParamsObject.name = "";
            let result = await request(appIns).post(signUpURL).send(loginParamsObject);
            expect(result.status).toBe(HttpResponseCode.BAD_REQUEST);
            expect(result.body.message).toContain("name");
        });

        it("should validate min length name", async () => {
            let loginParamsObject = getSignupParams();
            loginParamsObject.name = "s";
            let result = await request(appIns).post(signUpURL).send(loginParamsObject);
            expect(result.status).toBe(HttpResponseCode.BAD_REQUEST);
            expect(result.body.message).toContain("name");
        });

        it("should validate empty email", async () => {
            let loginParamsObject = getSignupParams();
            loginParamsObject.email = "";
            let result = await request(appIns).post(signUpURL).send(loginParamsObject);
            expect(result.status).toBe(HttpResponseCode.BAD_REQUEST);
            expect(result.body.message).toContain("email");
        });

        it("should validate empty email length", async () => {
            let loginParamsObject = getSignupParams();
            loginParamsObject.email = "s";
            let result = await request(appIns).post(signUpURL).send(loginParamsObject);
            expect(result.status).toBe(HttpResponseCode.BAD_REQUEST);
            expect(result.body.message).toContain("email");
        });

        it("should validate valid email", async () => {
            let loginParamsObject = getSignupParams();
            loginParamsObject.email = "s@s";
            let result = await request(appIns).post(signUpURL).send(loginParamsObject);
            expect(result.status).toBe(HttpResponseCode.BAD_REQUEST);
            expect(result.body.message).toContain("email");
        });

        it("should validate existing email", async () => {
            let loginParamsObject = getSignupParams();
            loginParamsObject.email = "perubesu1@gmail.com";
            let result = await request(appIns).post(signUpURL).send(loginParamsObject);
            expect(result.status).toBe(HttpResponseCode.BAD_REQUEST);
            expect(result.body.message).toBe("User already exists");
        });

        it("should validate existing mobile", async () => {
            let loginParamsObject = getSignupParams();
            loginParamsObject.mobile_number = "8250778560";
            let result = await request(appIns).post(signUpURL).send(loginParamsObject);
            expect(result.status).toBe(HttpResponseCode.BAD_REQUEST);
            expect(result.body.message).toBe("User already exists");
        });

        it("should sign up successfully", async () => {
            let loginParamsObject = getSignupParams();
            let result = await request(appIns).post(signUpURL).send(loginParamsObject);
            expect(result.status).toBe(HttpResponseCode.RESOURCES_CREATED);
            expect(result.body.result).toHaveProperty("id");
        });
    })
});