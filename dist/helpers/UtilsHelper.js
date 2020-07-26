"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsHelper = void 0;
class UtilsHelper {
    static isMethodReturnedValueTruthy(methoReturnedValue) {
        let isMethodReturnValueTruthy = true;
        if (methoReturnedValue === null || methoReturnedValue === undefined || methoReturnedValue === '' || (methoReturnedValue instanceof Array && methoReturnedValue.length === 0) || (methoReturnedValue instanceof Object && Object.keys(methoReturnedValue).length === 0)) {
            isMethodReturnValueTruthy = false;
        }
        return isMethodReturnValueTruthy;
    }
}
exports.UtilsHelper = UtilsHelper;
//# sourceMappingURL=UtilsHelper.js.map