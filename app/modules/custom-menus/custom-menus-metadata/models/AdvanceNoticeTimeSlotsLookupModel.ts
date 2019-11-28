
import { sequelize } from '@app/config/Sequelize';
import * as Sequelize from 'sequelize';

import IAdvanceNoticeTimeSlotsLookup from './interfaces/IAdvanceNoticeTimeSlotsLookup';

interface IAdvanceNoticeTimeSlotsLookupInstance extends Sequelize.Instance<IAdvanceNoticeTimeSlotsLookup>, IAdvanceNoticeTimeSlotsLookup { }

const AdvanceNoticeTimeSlotsLookupModel = sequelize.define<IAdvanceNoticeTimeSlotsLookupInstance, IAdvanceNoticeTimeSlotsLookup>(
    'advance_notice_time_slots_lookup',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'type',
        },
    }, {
        timestamps: true,
        underscored: true,
    },
);

export default AdvanceNoticeTimeSlotsLookupModel;
