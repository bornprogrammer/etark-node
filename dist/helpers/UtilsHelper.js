"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsHelper = void 0;
const ObjectHelper_1 = require("./ObjectHelper");
class UtilsHelper {
    static isMethodReturnedValueTruthy(methoReturnedValue) {
        let isMethodReturnValueTruthy = true;
        if (methoReturnedValue === null || methoReturnedValue === undefined || methoReturnedValue === '' || (methoReturnedValue instanceof Array && methoReturnedValue.length === 0) || (methoReturnedValue instanceof Object && Object.keys(methoReturnedValue).length === 0)) {
            isMethodReturnValueTruthy = false;
        }
        return isMethodReturnValueTruthy;
    }
    static getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1); // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        function deg2rad(deg) {
            return deg * (Math.PI / 180);
        }
        return d;
    }
    static generateRandomNumberBetweenRange(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    static replaceAllStr(objectData, strVal, openDelimiter = "{{", closeDelimiter = "}}") {
        let builtStr = strVal;
        if (ObjectHelper_1.ObjectHelper.isObjectNotEmpty(objectData)) {
            for (const key in objectData) {
                let regExp = new RegExp(`${openDelimiter}${key}${closeDelimiter}`, "g");
                builtStr = builtStr.replace(regExp, objectData[key]);
            }
        }
        return builtStr;
    }
}
exports.UtilsHelper = UtilsHelper;
//# sourceMappingURL=UtilsHelper.js.map