

import request from 'supertest';
import { BaseRestAPIIntegration } from './BaseRestAPIIntegration';


export abstract class BaseGetRestAPIIntegration extends BaseRestAPIIntegration {

    protected queryString: any;
    /**
     *
     */
    constructor() {
        super();
    }

    public async callAPI(urlPath?: string) {
        this.beforeCallingAPI();
        let result = await request(this.serverIns).get(this.buildURL(urlPath)).send();
        return result;
    }

    public buildURL(urlPath?: string): string {
        let url = super.buildURL();

        return url;
    }


}