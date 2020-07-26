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
                        if (!callableResult) {
                            break;
                        }
                        // this.doPreservedOrMergeResults(callableObj, callableResult);
                    }
                    // this.preservedResultsContainer.push(result);
                }
            }
            catch (error) {
                throw error;
            }
            return result;
        });
        this.callableFunctionContainer = [];
    }
    setMethod(methodCoordinatorEntity) {
        this.callableFunctionContainer.push(methodCoordinatorEntity);
        return this;
    }
    buildMethodParamEntity(topMethodParam, methodParam, lastInvokedMethodParam) {
        return { topMethodParam, methodParam, lastInvokedMethodParam };
    }
}
exports.default = MethodCoordinator;
//# sourceMappingURL=MethodCordinator.js.map