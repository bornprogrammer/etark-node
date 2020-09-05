import { BaseTest } from "tests/BaseTest.test";
import ArrayHelper from "@app/helpers/ArrayHelper";



class ArrayHelperUnit extends BaseTest {

    /**
     *
     */
    constructor() {
        super();
        this.testSuiteName = "array helper test";
    }

    public describe = () => {

        describe("test array helper ", () => {

            it("should validate the empty params", this.validatePassingEmptyParams);

            it("should validate the valid params", this.validatePassingValidParams);

        })

    }

    private validatePassingEmptyParams = () => {
        let result = ArrayHelper.extractKeyFromArrayOfObject(null, 'sss');
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(0);
    }

    private validatePassingValidParams = () => {
        let result = ArrayHelper.extractKeyFromArrayOfObject([{ name: "sandeep" }, { name: "ankit" }], 'name');
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(2);
        expect(result).toEqual(['sandeep', 'ankit']);
    }
}

export const arrayHelperUnit = () => {
    return new ArrayHelperUnit();
}

arrayHelperUnit().runTest();