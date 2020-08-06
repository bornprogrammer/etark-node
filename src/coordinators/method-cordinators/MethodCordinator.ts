import MethodCoordinatorEntity from "../../entities/MethodCoordinatorEntity";
import MethodParamEntity from "../../entities/MethodParamEntity";
import { Coordinator } from "../Coordinator";
import ArrayHelper from "@app/helpers/ArrayHelper";
import { UtilsHelper } from "@app/helpers/UtilsHelper";

export default class MethodCoordinator implements Coordinator {

    private callableFunctionContainer: MethodCoordinatorEntity[];

    private storeResultAsContainer: any;

    constructor() {
        this.callableFunctionContainer = [];
        this.storeResultAsContainer = {};
    }

    public setMethod(methodCoordinatorEntity: MethodCoordinatorEntity): MethodCoordinator {
        this.callableFunctionContainer.push(methodCoordinatorEntity);
        return this;
    }

    public coordinate = async () => {
        let result = null;
        try {
            if (ArrayHelper.isArrayValid(this.callableFunctionContainer)) {
                let topParams = this.callableFunctionContainer[0].callableFunctionParams;
                for (const callableObj of this.callableFunctionContainer) {
                    const callableResult = await callableObj.callableFunction(this.buildMethodParamEntity(topParams, callableObj.callableFunctionParams, result));
                    result = callableResult;
                    if (!callableResult) {
                        break;
                    } else if (callableObj.storeResultAs) {
                        this.storeResultAsContainer[callableObj.storeResultAs] = result;
                    }
                    // this.doPreservedOrMergeResults(callableObj, callableResult);
                }
                // this.preservedResultsContainer.push(result);
            }
        } catch (error) {
            throw error;
        }
        return result;
    }

    private buildMethodParamEntity(topMethodParam?: any, methodParam?: any, lastInvokedMethodParam?: any): MethodParamEntity {
        return { topMethodParam, methodParam, lastInvokedMethodParam, methodReturnedValContainer: this.storeResultAsContainer };
    }
}