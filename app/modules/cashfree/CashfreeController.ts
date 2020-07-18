import BaseController from '@app/controllers/BaseController';
import { ctrlMethodHandlerIns } from '@app/method-handler/CtrlMethodHandler';
import { Request, Response } from 'express';
import { CashfreeRepositoryService, cashfreeRepositoryServiceIns } from './CashfreeRepositoryService';

class CashfreeController extends BaseController {

    constructor(cashfreeRepositoryService: CashfreeRepositoryService) {
        super(cashfreeRepositoryService);
    }

    public logCashfreeResponse = async (req: Request, res: Response) => {
        ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.logCashfreeResponse).setParams(req.body).call(req, res);
    }

    public logCashfreeResponseNRedirect = async (req: Request, res: Response) => {
        const resp = await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.logCashfreeResponseNRedirect).setParams(req.body).get();
        res.redirect(resp);
    }
}

export const cashfreeControllerIns = new CashfreeController(cashfreeRepositoryServiceIns);
