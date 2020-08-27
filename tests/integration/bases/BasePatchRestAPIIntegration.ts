import { BaseRestAPIIntegration } from "./BaseRestAPIIntegration";
import request from 'supertest';

export abstract class BasePatchRestAPIIntegration extends BaseRestAPIIntegration {
    /**
     *
     */
    constructor() {
        super();
    }

    public async callAPI(urlPath: string) {
        this.beforeCallingAPI();
        let url = this.buildURL(urlPath);
        let result = await request(this.serverIns).patch(url).send();
        return result;
    }

}