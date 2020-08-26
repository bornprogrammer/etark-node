import express, { Router } from "express";
import { responseServiceIns } from "@app/services/ResponseService";
import { HttpResponseError } from "@app/errors/HttpResponseError";
import InternalError from "@app/errors/InternalError";
import { date } from "joi";



export abstract class BaseRoutes {

    protected router: Router = null;

    constructor() {
        this.router = express.Router();
    }

    public abstract setRoutes(): Router;

    public setCtrlMethod = (ctrlCallback) => {
        return async (req, res) => {
            await this.callCtrlMethod(ctrlCallback, req, res);
        }
    }

    private callCtrlMethod = async (ctrlCallback, req, res) => {
        try {
            let result = await ctrlCallback(req, res);
            responseServiceIns.sendResponse(req, res, result);
        } catch (error) {
            if (error instanceof HttpResponseError) {
                responseServiceIns.sendErrorResponse(res, error);
            } else {
                responseServiceIns.sendErrorResponse(res, new InternalError());
            }
        }
    }
}