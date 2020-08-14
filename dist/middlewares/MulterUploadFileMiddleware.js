"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUploadFileMiddlewareIns = exports.MulterUploadFileMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
class MulterUploadFileMiddleware {
    constructor() {
        this.path = "src/public/uploads/";
        this.uploadSingle = (keyName) => {
            return this.multer.single(keyName);
        };
        var storage = multer_1.default.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.path);
            },
            filename: (req, file, cb) => {
                cb(null, file.fieldname + '-' + Date.now() + ".png");
            }
        });
        this.multer = multer_1.default({ storage: storage });
    }
}
exports.MulterUploadFileMiddleware = MulterUploadFileMiddleware;
exports.multerUploadFileMiddlewareIns = new MulterUploadFileMiddleware();
//# sourceMappingURL=MulterUploadFileMiddleware.js.map