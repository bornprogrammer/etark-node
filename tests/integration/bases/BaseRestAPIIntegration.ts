import { appInstance } from "@app/app"
import { HttpResponseCode } from "@app/enums/HttpResponseCodes";
import { extend } from "joi";
import { BaseTest } from "tests/BaseTest.test";
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

export abstract class BaseRestAPIIntegration extends BaseTest {

    protected serverIns: any;

    protected url: string;

    // protected testSuiteName: string;

    constructor() {
        super();
    }

    public async runTest() {
        beforeEach(() => {
            this.beforeEach();
        })
        afterEach(() => {
            this.afterEach();
        })
        describe(this.testSuiteName, this.describe);
    }

    // public abstract async describe();

    public abstract async callAPI(urlPath: string);

    public callNCompareStatus = async (statusCode: HttpResponseCode, urlPath?: string) => {
        let result = await this.callAPI(urlPath);
        expect(result.status).toBe(statusCode);
        return result;
    }

    protected async beforeCallingAPI(): Promise<any> {

    }

    public async beforeEach() {
        this.openServer();
    }

    public async afterEach() {
        await this.closeServer();
    }

    public openServer() {
        this.serverIns = appInstance.server;
    }

    public buildURL(urlPath?: string): string {
        urlPath = urlPath || "";
        return "/api/" + this.url + urlPath;
    }

    public async closeServer() {
        await this.serverIns.close();
    }

}