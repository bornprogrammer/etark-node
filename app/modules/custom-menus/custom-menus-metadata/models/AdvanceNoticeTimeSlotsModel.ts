
import { sequelize } from '@app/config/Sequelize';
import IAdvanceNoticeTimeSlots from '@app/modules/custom-menus/custom-menus-metadata/models/interfaces/IAdvanceNoticeTimeSlots';
import * as Sequelize from 'sequelize';

interface IAdvanceNoticeTimeSlotsInstance extends Sequelize.Instance<IAdvanceNoticeTimeSlots>, IAdvanceNoticeTimeSlots { }

const CartModel = sequelize.define<IAdvanceNoticeTimeSlotsInstance, IAdvanceNoticeTimeSlots>(
    'advance_notice_time_slots',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
    }, {
        timestamps: true,
        underscored: true,
    },
);

export default CartModel;
