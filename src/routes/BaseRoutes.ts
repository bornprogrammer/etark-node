import express, { Router } from "express";
import { responseServiceIns } from "@app/services/ResponseService";
import { HttpResponseError } from "@app/errors/HttpResponseError";
import InternalError from "@app/errors/InternalError";



export class BaseRoutes {

    protected router = express.Router();

    public setCtrlMethod = (ctrlCallback) => {
        return async (req, res) => {
            await this.callCtrlMethod(ctrlCallback, req, res);
        }
    }

    private callCtrlMethod = async (ctrlCallback, req, res) => {
        try {
            let result = await ctrlCallback(req, res);
            console.log(result);
        } catch (error) {
            if (error instanceof HttpResponseError) {
                responseServiceIns.sendErrorResponse(res, error);
            } else {
                responseServiceIns.sendErrorResponse(res, new InternalError());
            }
        }
    }
}