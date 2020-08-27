import { appInstance } from "@app/app"
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

export abstract class BaseRestAPIIntegration {

    protected serverIns: any;

    protected url: string;

    protected testSuiteName: string;

    constructor() {

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

    public abstract async describe();

    public abstract async callAPI(urlPath: string);

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