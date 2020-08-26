
import request from 'supertest';
import { appInstance } from '@app/app';
import { HttpResponseCode } from '@app/enums/HttpResponseCodes';
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

describe("Authentication", () => {

    let appIns;

    beforeEach(() => { appIns = appInstance.server });

    afterEach(() => { appIns.close() });

    describe("login", () => {

        let unauthorizedMessage = "either username or password is wrong";

        let getLoginParams = () => {
            return {
                mobile_number: "8250778560",
                password: "etark2020"
            }
        }

        it("should return bad request status for invalid mobile number", async () => {
            let loginParamsObject = getLoginParams();
            loginParamsObject.mobile_number = "";
            let result = await request(appIns).post("/api/auth/login").send(loginParamsObject);
            expect(result.status).toBe(HttpResponseCode.BAD_REQUEST);
            expect(result.body.message).toContain("mobile_number");
        });

        it("should return bad request status for invalid mobile number length", async () => {
            let loginParamsObject = getLoginParams();
            loginParamsObject.mobile_number = "95554045";
            let result = await request(appIns).post("/api/auth/login").send(loginParamsObject);
            expect(result.status).toBe(HttpResponseCode.BAD_REQUEST);
            expect(result.body.message).toContain("mobile_number");
        });

        it("should return unauthorized request status for wrong mobile number", async () => {
            let loginParamsObject = getLoginParams();
            loginParamsObject.password = "1145481975";
            let result = await request(appIns).post("/api/auth/login").send(loginParamsObject);
            expect(result.body.message).toBe(unauthorizedMessage);
            expect(result.status).toBe(HttpResponseCode.UNAUTHORIZED);
        });

        it("should validate empty password", async () => {
            let loginParamsObject = getLoginParams();
            loginParamsObject.password = "";
            let result = await request(appIns).post("/api/auth/login").send(loginParamsObject);
            expect(result.body.message).toContain("password");
            expect(result.status).toBe(HttpResponseCode.BAD_REQUEST);
        });

        it("should return unauthorized request status for wrong password", async () => {
            let loginParamsObject = getLoginParams();
            loginParamsObject.password = "9945487519";
            let result = await request(appIns).post("/api/auth/login").send(loginParamsObject);
            expect(result.status).toBe(HttpResponseCode.UNAUTHORIZED);
            expect(result.body.message).toBe(unauthorizedMessage);
        });

        it("should return successfully login", async () => {
            let loginParamsObject = getLoginParams();
            let result = await request(appIns).post("/api/auth/login").send(loginParamsObject);
            expect(result.status).toBe(HttpResponseCode.RESOURCES_CREATED);
        });

    })
});