
import requestPromise from 'request-promise';
import { HttpMethodEnum } from '@app/enums/HttpMethodEnum';
import { ObjectHelper } from '@app/helpers/ObjectHelper';

export class HttpService {
    protected rpOptions: any;
    public constructor(uri: string, method: HttpMethodEnum) {
        this.rpOptions = { uri, method, headers: {} };
    }

    public setHeaders(key: string, val: string) {
        this.rpOptions.headers[key] = val;
        return this;
    }

    public setHeadersAsObj(headers: object) {
        if (ObjectHelper.isObjectNotEmpty(headers)) {
            // tslint:disable-next-line: forin
            for (const key in headers) {
                this.rpOptions.headers[key] = headers[key];
            }
        }
        return this;
    }

    public setQueryStr(obj: object) {
        this.rpOptions.qs = obj;
    }

    public call = async () => {
        try {
            let resp = await requestPromise(this.rpOptions);
            resp = !this.rpOptions.json ? JSON.parse(resp) : resp;
            return resp;
        } catch (error) {
            throw error;
        }
    }
}