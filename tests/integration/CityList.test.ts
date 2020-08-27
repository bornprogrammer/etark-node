import { appInstance } from '@app/app';

import request from 'supertest';

require('mysql2/node_modules/iconv-lite').encodingExists('foo');

describe("city api", () => {

    let serverIns;

    beforeEach(() => { serverIns = appInstance.server; })

    afterEach(() => { serverIns.close(); })

    it("get city list", async () => {

        let result = await request(serverIns).get("/api/masters/cities");

        expect(result.body.result).toBeInstanceOf(Array);

        expect(result.body.result.length).toBeGreaterThan(5);
    })
})
