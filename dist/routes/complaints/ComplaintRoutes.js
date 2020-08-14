"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintRoutes = void 0;
const ComplaintController_1 = require("@app/features/complaints/ComplaintController");
const express_1 = __importDefault(require("express"));
const MulterUploadFileMiddleware_1 = require("@app/middlewares/MulterUploadFileMiddleware");
class ComplaintRoutes {
    static setRoutes() {
        let router = express_1.default.Router();
        router.post("/", ComplaintController_1.complaintControllerIns.addComplaints);
        router.post("/:id/device-images", ComplaintController_1.complaintControllerIns.addDeviceImages);
        router.get("/:id/winning-chances", ComplaintController_1.complaintControllerIns.getChancesOfWinning);
        router.post("/:id/compentsation", ComplaintController_1.complaintControllerIns.addCompensation);
        router.put("/:id/compentsation/:complain_detail_id", ComplaintController_1.complaintControllerIns.updateCompensation);
        router.post("/upload-invoice", MulterUploadFileMiddleware_1.multerUploadFileMiddlewareIns.uploadSingle("invoice"), ComplaintController_1.complaintControllerIns.uploadInvoice);
        router.post("/upload-device-image", MulterUploadFileMiddleware_1.multerUploadFileMiddlewareIns.uploadSingle("device-image"), ComplaintController_1.complaintControllerIns.uploadInvoice);
        return router;
    }
}
exports.ComplaintRoutes = ComplaintRoutes;
//# sourceMappingURL=ComplaintRoutes.js.map