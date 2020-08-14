"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const CtrlMethodCoordinator_1 = require("@app/coordinators/method-cordinators/CtrlMethodCoordinator");
class BaseController {
    constructor() {
    }
    getCtrlMethodCoordinator() {
        return new CtrlMethodCoordinator_1.CtrlMethodCoordinator();
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=BaseController.js.map