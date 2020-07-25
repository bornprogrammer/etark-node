import moment from 'moment';
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

    public static getCurrentDateAsMysqlStr(): string {
        return moment(new Date()).format('YYYY-MM-DD');
    }

    public static getCurrentDateAsStrWithFormat(dateFormat): string {
        return moment(new Date()).format(dateFormat);
    }

    public static getCurrentDateTimeAsMysqlStr(): string {
        return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    }

    // public static getCurrentUTCDateAsStrWithFormat(dateFormat): string {
    //     return moment(new Date()).format(dateFormat);
    // }

    public static getCurrentUTCDateTimeAsMysqlStr(): string {
        return moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    }

    public static getCurrentUTCDateAsMysqlStr(): string {
        return moment(new Date()).utc().format('YYYY-MM-DD');
    }
}