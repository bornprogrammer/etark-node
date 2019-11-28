import BaseController from '@app/controllers/BaseController';
import { HttpGetService, httpGetServiceIns } from '@app/http/HttpGetService';
import { httpPostServiceIns } from '@app/http/HttpPostService';
import { ctrlMethodHandlerIns } from '@app/method-handler/CtrlMethodHandler';
import AppSessionService from '@app/services/AppSessionService';
import { Request, Response } from 'express';
import { CryptoHelper } from '../helper/CryptoHelper';
import { langHelperIns } from '../helper/LangHelper';
import { resourceHelperIns } from '../helper/ResourceHelper';
import { CartRepositoryService, cartRepositoryServiceIns } from './CartRepositoryService';

class CartController extends BaseController {

    constructor(cartRepositoryService: CartRepositoryService) {
        super(cartRepositoryService);
    }

    public addCart = async (req: Request, res: Response) => {
        const shipping_address = req.body.cart_details.shipping_address;
        shipping_address.user_id = AppSessionService.getUserId(req);
        const cartParams = { user_id: AppSessionService.getUserId(req), cart_value: req.body.cart_details.cart_value, cart_items: req.body.cart_details.cart_items, shipping_address, type: req.body.cart_details.type };
        ctrlMethodHandlerIns.setParams(cartParams).setMethodHandler(this.mRepositoryService.addCart).call(req, res);
    }

    // public logCashfreeResponse = async (req: Request, res: Response) => {
    //     ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.logCashfreeResponse).setParams(req.body).call(req, res);
    // }

    public deleteCartItems = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.deleteCartItems).setParams(req.params.id).call(req, res);
    }
}

export const cartControllerIns = new CartController(cartRepositoryServiceIns);
