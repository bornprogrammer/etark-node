

export class ObjectHelper {

    public static isObjectNotEmpty(input: object) {
        let isObjectValid = false;
        if (input && (input instanceof Object && Object.keys(input).length > 0)) {
            isObjectValid = true;
        }
        return isObjectValid;
    }

}   
