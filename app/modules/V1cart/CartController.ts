import BaseController from '@app/controllers/BaseController';
import { ctrlMethodHandlerIns } from '@app/method-handler/CtrlMethodHandler';
import AppSessionService from '@app/services/AppSessionService';
import { Request, Response } from 'express';
import { CartRepositoryService, cartRepositoryServiceIns } from './CartRepositoryService';

class CartController extends BaseController {

    constructor(cartRepositoryService: CartRepositoryService) {
        super(cartRepositoryService);
    }

    public addCart = async (req: Request, res: Response) => {
        const cartParams = { user_id: AppSessionService.getUserId(req), cart_value: req.body.cart_details.cart_value, cart_items: req.body.cart_details.cart_items };
        ctrlMethodHandlerIns.setParams(cartParams).setMethodHandler(this.mRepositoryService.addCart).call(req, res);
    }

    public updateCart = async (req: Request, res: Response) => {
        const cartParams = { user_id: AppSessionService.getUserId(req), cart_value: req.body.cart_details.cart_value, cart_items: req.body.cart_details.cart_items, cart_id: req.params.id };
        ctrlMethodHandlerIns.setParams(cartParams).setMethodHandler(this.mRepositoryService.updateCart).call(req, res);
    }

    // public logCashfreeResponse = async (req: Request, res: Response) => {
    //     ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.logCashfreeResponse).setParams(req.body).call(req, res);
    // }

    public deleteCart = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.deleteCart).setParams(req.params.id).call(req, res);
    }

}

export const cartControllerIns = new CartController(cartRepositoryServiceIns);
