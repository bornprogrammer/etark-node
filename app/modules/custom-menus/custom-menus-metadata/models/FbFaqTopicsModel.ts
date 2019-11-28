
import { sequelize } from '@app/config/Sequelize';
import * as Sequelize from 'sequelize';

import IFaqTopics from './interfaces/IFbFaqTopics';

interface IFaqTopicsInstance extends Sequelize.Instance<IFaqTopics>, IFaqTopics { }

const CartModel = sequelize.define<IFaqTopicsInstance, IFaqTopics>(
    'cart_v1',
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
