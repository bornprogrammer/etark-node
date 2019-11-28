import DIContainer from '@app/DIContainer';

export default abstract class MethodHandler {
    protected callable: CallableFunction;
    protected methodParams: any;
    constructor() {
        // tslint:disable-next-line: no-console
        console.log('method handler got instantiated');
    }

    public setMethodHandler(callable: CallableFunction) {
        this.callable = callable;
        return this;
    }

    public setParams(methodParams: any) {
        this.methodParams = methodParams;
        return this;
    }

    /**
     * would be used to call the service method and send response back to callie
     */
    public async get() {
        try {
            const clone = this.getCloned();
            const result = await clone.callable(clone.methodParams);
            return result;
        } catch (error) {
            throw error;
        }
    }

    protected resetInsParams() {
        this.callable = null;
        this.methodParams = null;
        return this;
    }

    protected getCloned() {
        const clone = Object.assign({}, this);
        this.resetInsParams();
        return clone;
    }
}
