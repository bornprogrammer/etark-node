import { StoreResultAsEnums } from "@app/enums/StoreResultAsEnums";


export default interface MethodCoordinatorEntity {

    callableFunction: CallableFunction;

    callableFunctionParams?: any;

    storeResultAs?: StoreResultAsEnums;

}  