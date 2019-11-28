import { NextFunction, Request, Response } from 'express';
import { reporters } from 'mocha';
import BaseMiddleware from './BaseMiddleware';

export default class DishOwnerMiddleware extends BaseMiddleware {

    public static execute(req: Request, res: Response, next: NextFunction) {
        // tslint:disable-next-line: no-console
        console.log('dish');
        let data = reporters.spec;
        next();
    }

    private static exclude = ['api/forgotpassword'];
    public execute(req: Request, res: Response, next: NextFunction) {
        throw new Error('Method not implemented.');
    }
}
