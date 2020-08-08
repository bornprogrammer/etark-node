import { HttpMethodEnum } from '@app/enums/HttpMethodEnum';
import { HttpService } from './HttpService';

class HttpPostService extends HttpService {
    constructor(url: string) {
        super(url, HttpMethodEnum.POST);
    }

    public setPayload(payload: object) {
        this.setHeaders('content-type', 'application/json');
        this.rpOptions.json = true;
        this.rpOptions.body = payload;
        return this;
    }

    public setFormUrlEncodedPayload(payload: object) {
        this.setHeaders('content-type', 'application/x-www-form-urlencoded');
        this.rpOptions.form = payload;
        return this;
    }
}

export const httpPostServiceIns = (url: string): HttpPostService => {
    return new HttpPostService(url);
};