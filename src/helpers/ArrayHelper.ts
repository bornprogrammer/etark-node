import { array } from "joi";

export default class ArrayHelper {

    /**
     * will return true if array valid
     * @param arrayVal 
     */
    public static isArrayValid(arrayVal: any[]): boolean {
        return arrayVal && arrayVal instanceof Array && arrayVal.length > 0;
    }

    public static extractKeyFromArrayOfObject(arrays: any[], key: string): string[] {
        let values = [];
        if (ArrayHelper.isArrayValid(arrays)) {
            arrays.map((item) => {
                values.push(item[key]);
            })
        }
        return values;

    }

}