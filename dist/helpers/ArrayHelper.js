"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArrayHelper {
    /**
     * will return true if array valid
     * @param arrayVal
     */
    static isArrayValid(arrayVal) {
        return arrayVal && arrayVal instanceof Array && arrayVal.length > 0;
    }
}
exports.default = ArrayHelper;
//# sourceMappingURL=ArrayHelper.js.map