import MethodCoordinatorEntity from "./MethodCoordinatorEntity";
import MethodParamEntity from "./MethodParamEntity";
import { Coordinator } from "../Coordinator";
import ArrayHelper from "@app/helpers/ArrayHelper";

export default class MethodCordinator implements Coordinator {

    private callableFunctionContainer: MethodCoordinatorEntity[];

    constructor() {
        this.callableFunctionContainer = [];
    }

    public setMethod(methodCoordinatorEntity: MethodCoordinatorEntity): MethodCordinator {
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
        return { topMethodParam, methodParam, lastInvokedMethodParam };
    }
}