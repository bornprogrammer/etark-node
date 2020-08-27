

import request from 'supertest';
import { appInstance } from '@app/app';
import { ServiceCenterActivityTypeEnum } from '@app/enums/ServiceCenterActivityTypeEnum';
import { HttpResponseCode } from '@app/enums/HttpResponseCodes';
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

describe("service center activity post api", () => {

    let appIns;

    beforeEach(() => { appIns = appInstance.server });

    afterEach(async () => { await appIns.close() });

    let getURL = () => {
        return "/api/sc/activity/1/";
    };

    describe("service center activity", () => {

        it("should validate wrong activity type", async () => {
            let url = getURL();
            url += "ssss";
            let result = await request(appIns).patch(url).send();
            expect(result.status).toBe(HttpResponseCode.BAD_REQUEST);
            expect(result.body.message).toContain("activity_type");
        })

        it("should validate passing wrong order activity type", async () => {
            let url = getURL();
            url += ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_DECLINED_PAYMENT;
            let result = await request(appIns).patch(url).send();
            expect(result.status).toBe(HttpResponseCode.EXCEPTION_FAILED);
            // expect(result.body.message).toContain("");
        })

        it("should pass right order activity type", async () => {
            let url = getURL();
            url += ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_DECLINED_PAYMENT;
            let result = await request(appIns).patch(url).send();
            expect(result.status).toBe(HttpResponseCode.EXCEPTION_FAILED);
            // expect(result.body.message).toContain("");
        })

    })

})

