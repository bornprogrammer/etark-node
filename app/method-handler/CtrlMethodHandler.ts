import { collectionTransformerIns } from '@app/collections/CollectionTransformer';
import { INestedTransformConfigurationEntity } from '@app/collections/INestedTransformConfigurationEntity';
import { nestedCollectionTransformerIns, NestedCollectionTransformer } from '@app/collections/NestedCollectionTransformer';
import { Transformer } from '@app/collections/Transformer';
import ErrorFactory from '@app/errors/ErrorFactory';
import { inputHelperIns } from '@app/modules/helper/InputHelper';
import { responseServiceIns } from '@app/response-handler/ResponseService';
import AppSessionService from '@app/services/AppSessionService';
import { Request, Response } from 'express';
import MethodHandler from './MethodHandler';

/**
 * would be used inside ctrl mthod to cll repo srvice method
 */
class CtrlMethodHandler extends MethodHandler {
    private transformer: any;
    private nestedTransformer: any;
    private nestedTransformerConf: INestedTransformConfigurationEntity[];
    constructor() {
        super();
        this.nestedTransformer = null;
    }

    public async call(req: Request, res: Response) {
        try {
            const clone = this.getCloned();
            const result = await clone.callable(clone.methodParams);
            this.sendResponse(req, res, result, clone.transformer, clone.nestedTransformer, clone.nestedTransformerConf);
        } catch (error) {
            responseServiceIns.sendErrorResponse(res, new ErrorFactory(error));
        }
    }

    public setTransformer = (transformer: Transformer) => {
        this.transformer = transformer;
        return this;
    }

    public setNestedTransformer = (conf: INestedTransformConfigurationEntity[]) => {
        this.nestedTransformer = nestedCollectionTransformerIns;
        this.nestedTransformerConf = conf;
        return this;
    }

    public setCustomNestedTransformer = (nestedCollectionTransformer: NestedCollectionTransformer, conf: INestedTransformConfigurationEntity[]) => {
        this.nestedTransformer = nestedCollectionTransformer;
        this.nestedTransformerConf = conf;
        return this;
    }

    protected resetInsParams() {
        super.resetInsParams();
        this.transformer = null;
        this.nestedTransformer = null;
        this.nestedTransformerConf = null;
        return this;
    }

    private sendResponse = (req: Request, res: Response, result: any, transformer, nestedTransformer: any, conf: INestedTransformConfigurationEntity[]) => {
        if (inputHelperIns.isArrayValidNNotEmpty(result)) {
            if (transformer) {
                collectionTransformerIns(result, transformer, AppSessionService.getUserId(req)).transform();
            }
            if (nestedTransformer) {
                result = nestedTransformer(result, AppSessionService.getUserId(req)).doTransform(conf);
            }
        }
        responseServiceIns.sendResponse(req, res, result);
    }
}

export const ctrlMethodHandlerIns = new CtrlMethodHandler();
