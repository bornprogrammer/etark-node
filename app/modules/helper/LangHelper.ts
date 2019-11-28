import { HttpMethodEnum } from '@app/enums/HttpMethodEnum';
import { Request } from 'express';
import { fileHelperIns } from './FileHelper';
import { resourceHelperIns } from './ResourceHelper';

class LangHelper {

    private langPath = 'lang/en/';

    public getSuccessMessage(req: Request): string {
        const langKey = this.buildLangKey(req, 'success');
        return this.retriveMessage(req, langKey);
    }

    public getFailedMessage(req: Request): string {
        const langKey = this.buildLangKey(req, 'failed');
        return this.retriveMessage(req, langKey);
    }

    private retriveMessage(req: Request, langKey: string) {
        const resourseLang = this.getResourceLang(req);
        return resourseLang[langKey];
    }

    private buildLangKey(req: Request, sucOrFailStr: string) {
        // tslint:disable-next-line: max-line-length
        const resourcePath = resourceHelperIns.getResourceParams(req) + '-' + req.method.toLowerCase() + '-' + sucOrFailStr;
        return resourcePath;
    }

    private getResourceLang(req: Request) {
        const langFileName = this.langPath + resourceHelperIns.getResourceName(req);
        const resLang = fileHelperIns.readJSONSyncUsingRequire(langFileName);
        return resLang;
    }

}

export const langHelperIns = new LangHelper();
