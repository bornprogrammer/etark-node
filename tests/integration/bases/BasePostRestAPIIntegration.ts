import { BaseRestAPIIntegration } from "./BaseRestAPIIntegration";
import request from 'supertest';

export abstract class BasePostRestAPIIntegration extends BaseRestAPIIntegration {

    protected postData: any;
    /**
     *
     */
    constructor() {
        super();
    }

    public async callAPI(urlPath?: string) {
        this.beforeCallingAPI();
        let result = await request(this.serverIns).post(this.buildURL(urlPath)).send(this.postData);
        return result;
    }
}