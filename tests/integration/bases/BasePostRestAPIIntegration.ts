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

    protected abstract getPostData();

    protected setPostFieldEmpty = (fieldKey: string) => {
        let postData = this.getPostData();
        postData[fieldKey] = "";
        this.postData = postData;
    }

    protected setPostFieldLengthOne = (fieldKey: string) => {
        let postData = this.getPostData();
        postData[fieldKey] = "a";
        this.postData = postData;
    }

    protected setPostFieldWrongVal = (fieldKey: string, fieldVal: string) => {
        let postData = this.getPostData();
        postData[fieldKey] = fieldVal;
        this.postData = postData;
    }

    protected resetPostFieldToOriginal = () => {
        let postData = this.getPostData();
        this.postData = postData;
    }
}