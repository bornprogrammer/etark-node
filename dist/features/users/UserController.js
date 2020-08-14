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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllerIns = exports.UserController = void 0;
const BaseController_1 = require("@app/controllers/BaseController");
const UserRequestParamsCoordinator_1 = require("./UserRequestParamsCoordinator");
const UserRepositoryService_1 = require("./UserRepositoryService");
class UserController extends BaseController_1.BaseController {
    /**
     *
     */
    constructor() {
        super();
        this.addAddress = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let params = UserRequestParamsCoordinator_1.UserRequestParamsCoordinator.getInstance(req).getAddAddressParams();
            yield this.getCtrlMethodCoordinator().setMethod({ callableFunctionParams: params, callableFunction: UserRepositoryService_1.userRepositoryServiceIns.addAddress }).send(req, res);
        });
        this.getSuccessPageDetail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let params = UserRequestParamsCoordinator_1.UserRequestParamsCoordinator.getInstance(req).getSuccessPageDetailParams();
            yield this.getCtrlMethodCoordinator().setMethod({ callableFunctionParams: params, callableFunction: UserRepositoryService_1.userRepositoryServiceIns.getSuccessPageDetail }).send(req, res);
        });
        this.downloadInvoice = (req, res) => __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.UserController = UserController;
exports.userControllerIns = new UserController();
//# sourceMappingURL=UserController.js.map