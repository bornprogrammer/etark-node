import { resourceHelperIns } from '@app/modules/helper/ResourceHelper';
import { Request } from 'express';
import BaseMiddleware from './BaseMiddleware';

/**
 * @description base middleware class would be implemented by every middleware class
 */
export default abstract class AppMiddleware extends BaseMiddleware {

    protected exclude = ['health-check', 'quests/foody-cron', 'cashfree/web-return', 'notifications/send', 'notifications/sendSms'];

    constructor() {
        super();
    }

    /**
     * will check that uri is ignored or not
     */

    protected isIgnored = (req: Request) => {
        // tslint:disable-next-line: no-string-literal
        const excludedUrl = req.url.substring(1);
        return this.exclude.indexOf(excludedUrl) >= 0;
    }
}
