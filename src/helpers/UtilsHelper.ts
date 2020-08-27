import { ObjectHelper } from "./ObjectHelper";
import { AppConstants } from "@app/constants/AppConstants";
import config from "config";


export class UtilsHelper {

    public static isMethodReturnedValueTruthy(methoReturnedValue: any): boolean {

        let isMethodReturnValueTruthy = true;
        if (methoReturnedValue === false || methoReturnedValue === null || methoReturnedValue === undefined || methoReturnedValue === '' || (methoReturnedValue instanceof Array && methoReturnedValue.length === 0) || (methoReturnedValue instanceof Object && Object.keys(methoReturnedValue).length === 0)) {
            isMethodReturnValueTruthy = false;
        }
        return isMethodReturnValueTruthy;
    }

    public static getDistanceFromLatLonInKm(lat1: any, lon1: any, lat2: any, lon2: any) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km

        function deg2rad(deg) {
            return deg * (Math.PI / 180);
        }
        return d;
    }

    public static generateRandomNumberBetweenRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    public static replaceAllStr(objectData: any, strVal: string, openDelimiter: string = "{{", closeDelimiter: string = "}}"): string {
        let builtStr = strVal;
        if (ObjectHelper.isObjectNotEmpty(objectData)) {
            for (const key in objectData) {
                let regExp = new RegExp(`${openDelimiter}${key}${closeDelimiter}`, "g");
                builtStr = builtStr.replace(regExp, objectData[key]);
            }
        }
        return builtStr;
    }

    public static getBaseURL(): string {
        let url = AppConstants.SERVER_BASE_URL + ":" + config.get('port');
        return url + "/";
    }


}