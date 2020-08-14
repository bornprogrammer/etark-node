"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectHelper = void 0;
class ObjectHelper {
    static isObjectNotEmpty(input) {
        let isObjectValid = false;
        if (input && (input instanceof Object && Object.keys(input).length > 0)) {
            isObjectValid = true;
        }
        return isObjectValid;
    }
    static buildStrFromKeyNValueOfObject(object, delimiter1, delimiter2) {
        let strFromKeyNValueOfObject = "";
        if (ObjectHelper.isObjectNotEmpty(object)) {
            for (const key in object) {
                strFromKeyNValueOfObject += key + delimiter1 + object[key] + delimiter2;
            }
        }
        return strFromKeyNValueOfObject;
    }
}
exports.ObjectHelper = ObjectHelper;
//# sourceMappingURL=ObjectHelper.js.map