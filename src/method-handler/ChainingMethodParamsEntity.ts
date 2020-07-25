export class ChainingMethodParamsEntity {
    private topParams: any; // will be params passed in top function
    private methodParams: any; // will be params for specific function
    private result: any;
    private preservedResultsContainer: any;

    public setTopParams(topParams: any) {
        this.topParams = topParams;
        return this;
    }

    public getTopParams() {
        return this.topParams;
    }

    public setMethodParams(methodParams: any) {
        this.methodParams = methodParams;
        return this;
    }

    public getMethodParams() {
        return this.methodParams;
    }

    public setResult(result: any) {
        this.result = result;
        return this;
    }

    public getResult() {
        return this.result;
    }

    public setPreservedResultsContainer(preservedResultsContainer: any) {
        this.preservedResultsContainer = preservedResultsContainer;
        return this;
    }

    public getPreservedResultsContainer() {
        return this.preservedResultsContainer;
    }

    public getPreservedResultsContainerByIndex(ind: number) {
        return this.preservedResultsContainer[ind];
    }
}
