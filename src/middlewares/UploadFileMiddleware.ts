

import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

export class UploadFileMiddleware {

    private multer: any

    private path = "uploads/";

    constructor() {
        var storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.path);
            },
            filename: (req, file, cb) => {
                cb(null, file.fieldname + '-' + Date.now() + "." + file.mimetype);
            }
        })
        this.multer = multer({ storage: storage });
    }

    public uploadSingle = async (req: Request, res: Response, next: NextFunction) => {
        this.multer.single("invoice");
        next();
    }

}

export const uploadFileMiddlewareIns = new UploadFileMiddleware();