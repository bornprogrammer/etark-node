"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterRoutes = void 0;
const express_1 = __importDefault(require("express"));
const MasterController_1 = require("@app/features/master/MasterController");
class MasterRoutes {
    static setRoutes() {
        let router = express_1.default.Router();
        router.get("/categories/:id/makers", MasterController_1.masterControllerIns.getMakerListByCategoryId);
        router.get("/merchants/:type", MasterController_1.masterControllerIns.getMerchantList);
        router.get("/plans", MasterController_1.masterControllerIns.getPlans);
        router.get("/cities", MasterController_1.masterControllerIns.getCities);
        router.get("/test-api", MasterController_1.masterControllerIns.testApi);
        return router;
    }
}
exports.MasterRoutes = MasterRoutes;
//# sourceMappingURL=MasterRoutes.js.map