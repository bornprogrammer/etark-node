import BaseController from '@app/controllers/BaseController';
import { ctrlMethodHandlerIns } from '@app/method-handler/CtrlMethodHandler';
import AppSessionService from '@app/services/AppSessionService';
import { Request, Response } from 'express';
import { fileHelperIns } from '../helper/FileHelper';
import { resourceHelperIns } from '../helper/ResourceHelper';
import { HubLevelRepositoryService, hubLevelRepositoryServiceIns } from './HubLevelRepositoryService';

class HubLevelController extends BaseController {

    constructor(hubLevelRepositoryService: HubLevelRepositoryService) {
        super(hubLevelRepositoryService);
    }

    public getUserAddedHubs = async (req: Request, res: Response) => {
        // tslint:disable-next-line: max-line-length
        const params = { userId: AppSessionService.getUserId(req), ...req.query };
        await ctrlMethodHandlerIns.setParams(params)
            .setMethodHandler(this.mRepositoryService.getUserAddedHubs).call(req, res);
    }

    public hubHome = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns.setParams(AppSessionService.getUserId(req))
            .setMethodHandler(this.mRepositoryService.hubHome).call(req, res);
    }

    public getAdminAddedHubs = async (req: Request, res: Response) => {
        // tslint:disable-next-line: max-line-length
        await ctrlMethodHandlerIns.setParams({ userId: AppSessionService.getUserId(req), ...req.query }).setMethodHandler(this.mRepositoryService.getAdminAddedHubs).call(req, res);
    }

    public getPrivateKitchenHubs = async (req: Request, res: Response) => {
        // tslint:disable-next-line: max-line-length
        await ctrlMethodHandlerIns.setParams({ userId: AppSessionService.getUserId(req), ...req.query }).setMethodHandler(this.mRepositoryService.getPrivateKitchenHubs).call(req, res);
    }

    public buySlot = async (req: Request, res: Response) => {
        const params = { user_id: AppSessionService.getUserId(req) };
        await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.buySlot)
            .setParams(params).call(req, res);
    }

    public buySecondaryHub = async (req: Request, res: Response) => {
        const params = { user_id: AppSessionService.getUserId(req), hub_id: req.body.hub_id };
        await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.buySecondaryHub)
            .setParams(params).call(req, res);
    }
    public deleteHub = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns
            .setParams({ userId: AppSessionService.getUserId(req), params: req.params })
            .setMethodHandler(this.mRepositoryService.deleteHub).call(req, res);
    }

    public searchHubs = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.searchHubs)
            .setParams({ userId: AppSessionService.getUserId(req), ...req.query }).call(req, res);
    }

    public searchHubsV1 = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.searchHubsV1)
            .setParams({ userId: AppSessionService.getUserId(req), ...req.query }).call(req, res);
    }

    public filterSearchHubs = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.filterSearchHubs)
            .setParams({ userId: AppSessionService.getUserId(req), ...req.query }).call(req, res);
    }
}

export const hubLevelControllerIns = new HubLevelController(hubLevelRepositoryServiceIns);
