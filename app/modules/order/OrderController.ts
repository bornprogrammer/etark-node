import BaseController from '@app/controllers/BaseController';
import { ctrlMethodHandlerIns } from '@app/method-handler/CtrlMethodHandler';
import AppSessionService from '@app/services/AppSessionService';
import { Request, Response } from 'express';
import { OrderRepositoryService, orderRepositoryServiceIns } from './OrderRepositoryService';
import { appendGoodiesImageUrlTransformerIns } from '@app/collections/AppendGoodiesImageUrlTransformer';

class OrderController extends BaseController {

    constructor(orderRepositoryService: OrderRepositoryService) {
        super(orderRepositoryService);
    }

    public addOrder = async (req: Request, res: Response) => {
        // const orderParams = { user_id: AppSessionService.getUserId(req), address: req.body.address, cart_id: req.body.cart_id, address_type: req.body.address_type, type: req.body.type, cart_value: req.body.cart_value };
        const orderParams = { user_id: AppSessionService.getUserId(req), ...req.body };
        ctrlMethodHandlerIns.setParams(orderParams).setMethodHandler(this.mRepositoryService.addOrder).call(req, res);
    }

    public deleteOrder = async (req: Request, res: Response) => {
        ctrlMethodHandlerIns.setParams({ user_id: AppSessionService.getUserId(req), orderId: req.params.id }).setMethodHandler(this.mRepositoryService.deleteOrder).call(req, res);
    }

    public getWebOrderInfo = async (req: Request, res: Response) => {
        ctrlMethodHandlerIns.setParams(req.params.id).setMethodHandler(this.mRepositoryService.getWebOrderInfo).setTransformer(appendGoodiesImageUrlTransformerIns).call(req, res);
    }

}

export const orderControllerIns = new OrderController(orderRepositoryServiceIns);
