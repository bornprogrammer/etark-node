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

    public static getBaseURLForAssetImage(): string {
        let url = UtilsHelper.getBaseURL() + "images/";
        return url;
    }

    public static getBaseURLForAssetFile(): string {
        let url = UtilsHelper.getBaseURL() + "files/";
        return url;
    }

    public static getBaseURLForUploadedImage(imageName: string): string {
        let url = UtilsHelper.getBaseURL() + "uploads/" + imageName;
        return url;
    }

    public static convertAmountInWords(num): string {
        if (!num) return 'N/A';
        if ((num = num.toString()).length > 9) return 'overflow';
        var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
        var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

        let n: any = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return; var str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
        return str;
    }


}