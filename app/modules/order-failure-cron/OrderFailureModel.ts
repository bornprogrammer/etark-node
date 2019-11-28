import { sequelize } from '@app/config/Sequelize';
import { Sequelize } from 'sequelize';
import { DateHelper } from '@app/modules/helper/DateHelper';
class OrderFailureModel {
    private sequelizeCon: Sequelize;
    constructor() {
        this.sequelizeCon = sequelize;
    }

    public getPendingOrders = async () => {
        try {

            const curDate = DateHelper.getCurrentDateAsMysqlStr();
            // tslint:disable-next-line: max-line-length
            const query = `select cv.id as cart_id,ov.id as order_id,cv.user_id,ov.status from cart_v1 cv
            LEFT JOIN order_v1 ov on cv.id=ov.cart_id
            where cv.is_enable=1 and cv.created_at<SUBDATE(now(),INTERVAL 30 MINUTE) 
            HAVING ov.status='pending' or ov.id is NULL`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            throw error;
        }
    }
}

export const orderFailureModelIns = new OrderFailureModel();
