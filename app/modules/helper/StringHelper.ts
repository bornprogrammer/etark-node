import { inputHelperIns } from './InputHelper';

export class StringHelper {

    /**
     * will replace the object
     * @param str
     * @param obj
     */
    public replaceStringPlaceHolderWithObjVal(str: string, obj: any) {
        let replacedString = str;
        if (inputHelperIns.isObjectValidNNotEmpty(obj)) {

            // tslint:disable-next-line: forin
            for (const objKey in obj) {
                replacedString = replacedString.replace(new RegExp(`<${objKey}>`, 'g'), obj[objKey]);
            }
        }
        return replacedString;
    }
}

export const stringHelperIns = new StringHelper();
