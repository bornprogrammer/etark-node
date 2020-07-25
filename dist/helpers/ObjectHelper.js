"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectHelper = void 0;
class ObjectHelper {
    isObjectNotEmpty(input) {
        let isObjectValid = false;
        if (input && (input instanceof Object && Object.keys(input).length > 0)) {
            isObjectValid = true;
        }
        return isObjectValid;
    }
}
exports.ObjectHelper = ObjectHelper;
//# sourceMappingURL=ObjectHelper.js.map