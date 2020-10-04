import moment from 'moment';
import { isStrictNullChecksEnabled } from 'tslint';
export class DateHelper {

    /**
     * a week ago
     * a month ago
     * a day ago
     * an hour ago
     * just now
     */

    public static getAgoFormat(datestr: string): string {
        let agoFormat = null;
        if (datestr) {
            agoFormat = moment(datestr).fromNow();
        }
        return agoFormat;
    }

    public static convertDateStr(datestr: string, format: string): string {
        let agoFormat = null;
        if (datestr) {
            agoFormat = moment(datestr).format(format);
        }
        return agoFormat;
    }

    public static getReadableDateFormat(dateStr: string): string {
        if (dateStr) {
            let dateObject = new Date(dateStr);
            return dateObject.getDate() + "/" + (dateObject.getMonth() + 1) + "/" + dateObject.getFullYear();
        }
        return null;
    }

    public static getReadableDateTimeFormat(dateStr: string): string {
        if (dateStr) {
            let dateObject = new Date(dateStr);
            return dateObject.getDate() + "/" + (dateObject.getMonth() + 1) + "/" + dateObject.getFullYear() + " " + dateObject.getHours() + " " + dateObject.getMinutes();
        }
        return null;
    }

    public static getCurrentDateAsMysqlStr(): string {
        return moment(new Date()).format('YYYY-MM-DD');
    }

    public static getCurrentDateAsStrWithFormat(dateFormat): string {
        return moment(new Date()).format(dateFormat);
    }

    public static getCurrentDateTimeAsMysqlStr(): string {
        return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    }

    public static getCurrentDateTimeObjectAsMysqlStr(dateString): string {
        return moment(new Date(dateString)).format('YYYY-MM-DD HH:mm:ss');
    }

    public static getHourDifference(dateString): any {
        let date1 = moment(new Date(dateString));
        let date2 = moment(new Date());
        var duration = moment.duration(date2.diff(date1));
        var hours = duration.asHours();
        return hours;
    }

    public static convertDateToUTCDate(mysqlStr: string, format?: string) {
        if (mysqlStr) {
            let date = new Date(mysqlStr);
            format = format || "YYYY-MM-DD HH:mm:ss";
            return moment(date).utc().format(format);
        }
        return "";
    }

    public static convertUTCDateToLocal(mysqlStr: string) {
        if (mysqlStr) {
            let moment1 = moment.utc(mysqlStr, "YYYY-MM-DD HH:mm:ss");
            return moment1.utcOffset("+0530").format('MMMM Do, YYYY h:mm A');
        }
        return "";
    }

    public static getCurrentUTCDateTimeAsMysqlStr(): string {
        return moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    }

    public static getCurrentUTCDateAsMysqlStr(): string {
        return moment(new Date()).utc().format('YYYY-MM-DD');
    }

    public static addHourToCurDate(hour: number) {
        let dateObject = new Date();
        dateObject.setHours(dateObject.getHours() + hour);
        return moment(dateObject).format('MMMM Do, YYYY h:mm A');
    }
}