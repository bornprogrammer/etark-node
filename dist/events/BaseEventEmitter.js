"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEventEmitter = void 0;
const events_1 = require("events");
const MethodCordinator_1 = __importDefault(require("@app/coordinators/method-cordinators/MethodCordinator"));
class BaseEventEmitter extends events_1.EventEmitter {
    constructor(eventName) {
        super();
        this.on(eventName, this.handle);
    }
    getMethodCoordinator() {
        return new MethodCordinator_1.default();
    }
}
exports.BaseEventEmitter = BaseEventEmitter;
//# sourceMappingURL=BaseEventEmitter.js.map