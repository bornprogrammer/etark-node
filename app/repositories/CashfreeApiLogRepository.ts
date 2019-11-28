import ICashfreeApiLog from '@app/interfaces/models/ICashfreeApiLog';
import db from '@app/models';

export class CashfreeApiLogRepository {

    public create = (apiLog: ICashfreeApiLog) => {
        return db.CashfreeApiLog.create(apiLog);
    }

}
