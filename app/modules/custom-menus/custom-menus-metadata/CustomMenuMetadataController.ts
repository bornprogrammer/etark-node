import BaseController from '@app/controllers/BaseController';
import Logger from '@app/services/Logger';
import {NextFunction, Request, Response} from 'express';
import CustomMenuMetadataService from './CustomMenuMetadataService';

export default class CustomMenuMetaDataController extends BaseController {

    constructor(private customMenuMetadataService: CustomMenuMetadataService ) {

        super(null);
        this.customMenuMetadataService = customMenuMetadataService;
    }

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            console.log(error);
            next(error);
        }

    }
}
