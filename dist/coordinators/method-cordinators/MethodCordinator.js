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
const ArrayHelper_1 = __importDefault(require("@app/helpers/ArrayHelper"));
const UtilsHelper_1 = require("@app/helpers/UtilsHelper");
class MethodCoordinator {
    constructor() {
        this.coordinate = () => __awaiter(this, void 0, void 0, function* () {
            let result = null;
            try {
                if (ArrayHelper_1.default.isArrayValid(this.callableFunctionContainer)) {
                    let topParams = this.callableFunctionContainer[0].callableFunctionParams;
                    for (const callableObj of this.callableFunctionContainer) {
                        const callableResult = yield callableObj.callableFunction(this.buildMethodParamEntity(topParams, callableObj.callableFunctionParams, result));
                        result = callableResult;
                        if (!UtilsHelper_1.UtilsHelper.isMethodReturnedValueTruthy(callableResult) && callableObj.notBreakWhenReturnedValueNotTruthy !== true) {
                            break;
                        }
                        if (callableObj.storeResultAs) {
                            this.storeResultAsContainer[callableObj.storeResultAs] = result;
                        }
                        if (callableObj.resultToBeReturnedAsFinalResult) {
                            this.finalResult = result;
                        }
                        // this.doPreservedOrMergeResults(callableObj, callableResult);
                    }
                }
            }
            catch (error) {
                console.log("error came ", error);
                throw error;
            }
            return this.finalResult || result;
        });
        this.callableFunctionContainer = [];
        this.storeResultAsContainer = {};
    }
    setMethod(methodCoordinatorEntity) {
        this.callableFunctionContainer.push(methodCoordinatorEntity);
        return this;
    }
    buildMethodParamEntity(topMethodParam, methodParam, lastInvokedMethodParam) {
        return { topMethodParam, methodParam, lastInvokedMethodParam, methodReturnedValContainer: this.storeResultAsContainer };
    }
}
exports.default = MethodCoordinator;
//# sourceMappingURL=MethodCordinator.js.map