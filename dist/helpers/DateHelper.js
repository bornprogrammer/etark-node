"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateHelper = void 0;
const moment_1 = __importDefault(require("moment"));
class DateHelper {
    /**
     * a week ago
     * a month ago
     * a day ago
     * an hour ago
     * just now
     */
    static getAgoFormat(datestr) {
        let agoFormat = null;
        if (datestr) {
            agoFormat = moment_1.default(datestr).fromNow();
        }
        return agoFormat;
    }
    static convertDateStr(datestr, format) {
        let agoFormat = null;
        if (datestr) {
            agoFormat = moment_1.default(datestr).format(format);
        }
        return agoFormat;
    }
    static getCurrentDateAsMysqlStr() {
        return moment_1.default(new Date()).format('YYYY-MM-DD');
    }
    static getCurrentDateAsStrWithFormat(dateFormat) {
        return moment_1.default(new Date()).format(dateFormat);
    }
    static getCurrentDateTimeAsMysqlStr() {
        return moment_1.default(new Date()).format('YYYY-MM-DD HH:mm:ss');
    }
    // public static getCurrentUTCDateAsStrWithFormat(dateFormat): string {
    //     return moment(new Date()).format(dateFormat);
    // }
    static getCurrentUTCDateTimeAsMysqlStr() {
        return moment_1.default(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    }
    static getCurrentUTCDateAsMysqlStr() {
        return moment_1.default(new Date()).utc().format('YYYY-MM-DD');
    }
}
exports.DateHelper = DateHelper;
//# sourceMappingURL=DateHelper.js.map