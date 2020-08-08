

export class ObjectHelper {

    public static isObjectNotEmpty(input: object) {
        let isObjectValid = false;
        if (input && (input instanceof Object && Object.keys(input).length > 0)) {
            isObjectValid = true;
        }
        return isObjectValid;
    }

    public static buildStrFromKeyNValueOfObject(object: any, delimiter1: string, delimiter2: string) {
        let strFromKeyNValueOfObject = "";
        if (ObjectHelper.isObjectNotEmpty(object)) {
            for (const key in object) {
                strFromKeyNValueOfObject += key + delimiter1 + object[key] + delimiter2;
            }
        }
        return strFromKeyNValueOfObject;
    }
}   
