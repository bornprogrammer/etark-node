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
exports.complaintControllerIns = exports.ComplaintController = void 0;
const BaseController_1 = require("@app/controllers/BaseController");
const ComplainRequestParamsCoordinator_1 = require("./ComplainRequestParamsCoordinator");
const ComplaintService_1 = require("./ComplaintService");
class ComplaintController extends BaseController_1.BaseController {
    /**
     *
     */
    constructor() {
        super();
        this.addComplaints = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let params = ComplainRequestParamsCoordinator_1.ComplainRequestParamsCoordinator.getInstance(req).getAddComplaintsParams();
            yield this.getCtrlMethodCoordinator().setMethod({ callableFunction: ComplaintService_1.complaintServiceIns.addComplaints, callableFunctionParams: params }).send(req, res);
        });
        this.addDeviceImages = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let params = ComplainRequestParamsCoordinator_1.ComplainRequestParamsCoordinator.getInstance(req).getAddDeviceImagesParams();
            yield this.getCtrlMethodCoordinator().setMethod({ callableFunction: ComplaintService_1.complaintServiceIns.addDeviceImages, callableFunctionParams: params }).send(req, res);
        });
        this.uploadInvoice = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // await this.getCtrlMethodCoordinator().setMethod({ callableFunction: complaintServiceIns.uploadInvoice, callableFunctionParams: req['file'] }).send(req, res);
            // nodeMailerServiceIns.sendHtml("service@etark.in", "iamabornprogrammer@gmail.com", "support email", "<h1>this is header file</h1>");
            yield this.getCtrlMethodCoordinator().sendData(req, res, req['file']);
        });
        this.getChancesOfWinning = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let params = ComplainRequestParamsCoordinator_1.ComplainRequestParamsCoordinator.getInstance(req).getChancesOfWinningParams();
            this.getCtrlMethodCoordinator().setMethod({ callableFunction: ComplaintService_1.complaintServiceIns.getChancesOfWinning, callableFunctionParams: params }).send(req, res);
        });
        this.addCompensation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let params = ComplainRequestParamsCoordinator_1.ComplainRequestParamsCoordinator.getInstance(req).getAddCompensationParams();
            this.getCtrlMethodCoordinator().setMethod({ callableFunction: ComplaintService_1.complaintServiceIns.addCompensation, callableFunctionParams: params }).send(req, res);
        });
        this.updateCompensation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let params = ComplainRequestParamsCoordinator_1.ComplainRequestParamsCoordinator.getInstance(req).getUpdateCompensationParams();
            this.getCtrlMethodCoordinator().setMethod({ callableFunction: ComplaintService_1.complaintServiceIns.updateCompensation, callableFunctionParams: params }).send(req, res);
        });
    }
}
exports.ComplaintController = ComplaintController;
exports.complaintControllerIns = new ComplaintController();
//# sourceMappingURL=ComplaintController.js.map