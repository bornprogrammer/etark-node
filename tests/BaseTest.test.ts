


export abstract class BaseTest {

    protected testSuiteName: string;

    constructor() {

    }

    public async runTest() {
        beforeEach(() => {
            this.beforeEach();
        })
        afterEach(() => {
            this.afterEach();
        })
        describe(this.testSuiteName, this.describe);
    }

    public abstract async describe();

    public async beforeEach() {

    }

    public async afterEach() {

    }
}