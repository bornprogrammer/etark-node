import DIContainer from '@app/DIContainer';
import BaseError from '@app/errors/BaseError';
import ResponseEntity from '@app/response-handler/ResponseEntity';
import BaseRepositoryService from '@app/services/BaseRepositoryService';
import { Response } from 'express';

export default class BaseController {

    protected mRepositoryService: any;

    constructor(mRepositoryService: BaseRepositoryService) {
        this.mRepositoryService = mRepositoryService;
    }

}
