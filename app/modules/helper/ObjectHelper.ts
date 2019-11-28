export default class ObjectHelper {

    public static extractKeyAndValFromObj(reqObj: object, inpObj: object) {

        const outputObj = {};
        // tslint:disable-next-line: forin
        for (const property in inpObj) {
            const key = inpObj[property];
            outputObj[key] = reqObj[property];
        }
        return outputObj;
    }
}
