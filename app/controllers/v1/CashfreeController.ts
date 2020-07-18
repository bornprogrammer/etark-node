import BaseController from '@app/controllers/BaseController';
import BuddyPayoutService from '@app/services/BuddyPayoutService';
import Logger from '@app/services/Logger';
import {Response} from 'express';

export class CashfreeController extends BaseController {

    private buddyPayoutService: BuddyPayoutService;

    constructor(buddyPayoutService: BuddyPayoutService) {
        super();
        this.buddyPayoutService = buddyPayoutService;
    }

    public webhook = async (req: any, res: Response, next) => {
        try {
            Logger.info({category: 'cashfreeWebhookCall', params: req});
            await this.buddyPayoutService.handleCashfreeEvents(req.query);
            return this.successResponse(res, '', {});
        } catch (error) {
            next(error);
        }
    }
}
