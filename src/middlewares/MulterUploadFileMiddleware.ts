
import multer from 'multer';

export class MulterUploadFileMiddleware {

    private multer: any

    private path = "src/public/uploads/";

    constructor() {
        var storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.path);
            },
            filename: (req, file, cb) => {
                cb(null, file.fieldname + '-' + Date.now() + ".png");
            }
        })
        this.multer = multer({ storage: storage });
    }

    public uploadSingle = (keyName: string): any => {
        return this.multer.single(keyName);
    }

}

export const multerUploadFileMiddlewareIns = new MulterUploadFileMiddleware();