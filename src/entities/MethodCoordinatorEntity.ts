import { StoreResultAs } from "@app/enums/StoreResultAs";



export default interface MethodCoordinatorEntity {

    callableFunction: CallableFunction;

    callableFunctionParams?: any;

    storeResultAs?: StoreResultAs;

    resultToBeReturnedAsFinalResult?: boolean;

}  