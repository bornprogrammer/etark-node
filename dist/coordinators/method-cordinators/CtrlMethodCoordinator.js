"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CtrlMethodCoordinator = void 0;
const MethodCordinator_1 = __importDefault(require("./MethodCordinator"));
const ResponseService_1 = require("@app/services/ResponseService");
const HttpResponseError_1 = require("@app/errors/HttpResponseError");
const InternalError_1 = __importDefault(require("@app/errors/InternalError"));
class CtrlMethodCoordinator extends MethodCordinator_1.default {
    /**
     *
     */
    constructor() {
        super();
        this.send = (request, res) => __awaiter(this, void 0, void 0, function* () {
            let result = null;
            try {
                result = yield this.coordinate();
                ResponseService_1.responseServiceIns.sendResponse(request, res, result);
            }
            catch (error) {
                this.sendError(res, error);
            }
        });
        this.sendError = (response, error) => {
            if (error instanceof HttpResponseError_1.HttpResponseError) {
                ResponseService_1.responseServiceIns.sendErrorResponse(response, error);
            }
            else {
                ResponseService_1.responseServiceIns.sendErrorResponse(response, new InternalError_1.default());
            }
        };
    }
    setMethod(methodCoordinatorEntity) {
        super.setMethod(methodCoordinatorEntity);
        return this;
    }
}
exports.CtrlMethodCoordinator = CtrlMethodCoordinator;
//# sourceMappingURL=CtrlMethodCoordinator.js.map