import { sequelize } from '@app/config/Sequelize';
import * as Sequelize from 'sequelize';
import IPostedCustomMenuTiming from './IPostedCustomMenuTiming';

interface IPostedCustomMenuTimingInstance extends Sequelize.Instance<IPostedCustomMenuTiming>, IPostedCustomMenuTiming {}

const PostedCustomMenuTimings = sequelize.define<IPostedCustomMenuTimingInstance, IPostedCustomMenuTiming>(
    'posted_custom_menu_timings',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        postedCustomMenuId: {
            type: Sequelize.INTEGER,
            field: 'posted_custom_menu_timings',
        },
        startAt: {
            type: Sequelize.TIME,
            field: 'start_at',
        },
        endAt: {
            type: Sequelize.TIME,
            field: 'start_at',
        },
        date: {
            type: Sequelize.DATE,
            field: 'date',
        },
    },
    {
        underscored: true,
        timestamps: true,
    },
);

export default PostedCustomMenuTimings;
