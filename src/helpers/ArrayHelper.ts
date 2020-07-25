
export default class ArrayHelper {

    /**
     * will return true if array valid
     * @param arrayVal 
     */
    public static isArrayValid(arrayVal: any[]): boolean {
        return arrayVal && arrayVal instanceof Array && arrayVal.length > 0;
    }

}