import { appInstance } from "@app/app";
import request from 'supertest';
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

describe("city api", () => {
    let serverIns;

    beforeEach(() => {
        serverIns = appInstance.server;
    })

    afterEach(() => {
        serverIns.close();
    })

    it("insert complain", () => {


    })


    it("chances of winning api", () => {


    })

    it("add plan", () => {


    })


    it("add address", () => {


    })


})
