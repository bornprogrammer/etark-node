import { BaseRestAPIIntegration } from "./BaseRestAPIIntegration";
import request from 'supertest';
import { BasePostRestAPIIntegration } from "./BasePostRestAPIIntegration";

export abstract class BasePutRestAPIIntegration extends BasePostRestAPIIntegration {

    protected postData: any;
    /**
     *
     */
    constructor() {
        super();
    }

    public async callAPI(urlPath?: string) {
        this.beforeCallingAPI();
        let result = await request(this.serverIns).put(this.buildURL(urlPath)).send(this.postData);
        return result;
    }


}