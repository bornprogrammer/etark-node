import { HttpMethodEnum } from '@app/enums/HttpMethodEnum';
import { HttpService } from './HttpService';

export class HttpGetService extends HttpService {

    constructor(url: string) {
        super(url, HttpMethodEnum.GET);
    }
}

export const httpGetServiceIns = (url: string): HttpGetService => {
    return new HttpGetService(url);
};
