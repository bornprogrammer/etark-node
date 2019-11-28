interface IChainingMethodEntity {
    nextMethod: CallableFunction;
    nextMethodParams: any;
    isResultPreserved?: boolean;
}
