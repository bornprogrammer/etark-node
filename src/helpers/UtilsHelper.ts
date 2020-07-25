

export class UtilsHelper {

    public static isMethodReturnedValueTruthy(methoReturnedValue: any): boolean {

        let isMethodReturnValueTruthy = true;
        if (methoReturnedValue === null || methoReturnedValue === undefined || methoReturnedValue === '' || (methoReturnedValue instanceof Array && methoReturnedValue.length === 0) || (methoReturnedValue instanceof Object && Object.keys(methoReturnedValue).length === 0)) {
            isMethodReturnValueTruthy = false;
        }
        return isMethodReturnValueTruthy;
    }
}