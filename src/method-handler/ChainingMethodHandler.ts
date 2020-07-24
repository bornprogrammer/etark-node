import { inputHelperIns } from '@app/modules/helper/InputHelper';
import { ChainingMethodParamsEntity } from './ChainingMethodParamsEntity';
import MethodHandler from './MethodHandler';

interface INextMethodObj {
    nextMethod: CallableFunction;
    nextMethodParams: any;
    isResultPreserved?: boolean;
    mergedKey?: string; // will merge the db result with topParamsObj
}

class ChainingMethodHandler extends MethodHandler {
    private nextMethodsContainer: INextMethodObj[];
    private preservedResultsContainer;
    private chainingMethodParamsEntity: ChainingMethodParamsEntity;
    private topParams: any;
    constructor() {
        super();
        this.nextMethodsContainer = [];
        this.preservedResultsContainer = [];
        this.chainingMethodParamsEntity = new ChainingMethodParamsEntity();
    }

    public setNextMethodHandler = (callable: CallableFunction, nextMethodParams?: any) => {
        this.nextMethodsContainer.push(this.buildNextMethodObj(callable, false, nextMethodParams));
        return this;
    }

    public setNextMethodHandlerNPreserveResult = (callable: CallableFunction, nextMethodParams?: any) => {
        this.nextMethodsContainer.push(this.buildNextMethodObj(callable, true, nextMethodParams));
        return this;
    }

    public setNextMethodHandlerNMergeResult = (callable: CallableFunction, mergingKey: string, nextMethodParams?: any) => {
        this.nextMethodsContainer.push(this.buildNextMethodObj(callable, true, nextMethodParams, mergingKey));
        return this;
    }

    // public get = async () => {
    //     try {
    //         let result = null;
    //         const topParams = this.nextMethodsContainer[0].nextMethodParams;
    //         result = await this.callIfNextMethodExists(topParams, result);
    //         result = await this.callIfNextMethodExists(topParams, result);
    //         result = await this.callIfNextMethodExists(topParams, result);
    //         result = await this.callIfNextMethodExists(topParams, result);
    //         result = await this.callIfNextMethodExists(topParams, result);
    //         this.preservedResultsContainer.push(result);
    //         return this.preservedResultsContainer;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    public get = async () => {
        try {
            let result = null;
            if (inputHelperIns.isArrayValidNNotEmpty(this.nextMethodsContainer)) {
                this.topParams = this.nextMethodsContainer[0].nextMethodParams;
                for (const callableObj of this.nextMethodsContainer) {
                    const callableResult = await callableObj.nextMethod(this.buildChainingMethodParamsEntity(this.topParams, callableObj.nextMethodParams, result));
                    result = callableResult;
                    if (!callableResult) {
                        break;
                    }
                    this.doPreservedOrMergeResults(callableObj, callableResult);
                }
                this.preservedResultsContainer.push(result);
            }
            return this.preservedResultsContainer;
        } catch (error) {
            throw error;
        }
    }

    // private callIfNextMethodExists = async (topParams, result) => {
    //     if (this.nextMethodsContainer.length > 0) {
    //         const callableObj = this.nextMethodsContainer.shift();
    //         const callableResult = await callableObj.nextMethod(this.buildChainingMethodParamsEntity(topParams, callableObj.nextMethodParams, result));
    //         this.doPreservedResults(callableObj, callableResult);
    //         return callableResult;
    //     }
    //     return result;
    // }

    private buildChainingMethodParamsEntity = (topParams, nextMethodParams, result): ChainingMethodParamsEntity => {
        this.chainingMethodParamsEntity.setTopParams(topParams).setMethodParams(nextMethodParams).setResult(result).setPreservedResultsContainer(this.preservedResultsContainer);
        return this.chainingMethodParamsEntity;
    }

    private doPreservedOrMergeResults(callableObj: INextMethodObj, result) {
        if (callableObj.isResultPreserved) {
            this.preservedResultsContainer.push(result);
        }
        if (callableObj.mergedKey) {
            this.topParams[callableObj.mergedKey] = result;
        }
    }

    private buildNextMethodObj = (callable: CallableFunction, isResultPreserved?: boolean, nextMethodParams?: any, mergingKey?: string): INextMethodObj => {
        const obj = { nextMethod: callable, isResultPreserved: isResultPreserved || false, nextMethodParams, mergedKey: mergingKey };
        return obj;
    }
}

export const chainingMethodHandlerIns = () => {
    return new ChainingMethodHandler();
};
