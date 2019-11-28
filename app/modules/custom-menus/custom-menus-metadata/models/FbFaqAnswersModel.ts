import { sequelize } from '@app/config/Sequelize';
import * as Sequelize from 'sequelize';
import ISample from './ISample';

interface ISampleInstance extends Sequelize.Instance<ISample>, ISample {}

const SampleModel = sequelize.define<ISampleInstance, ISample>(
    'table_name',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
    },
    {
        underscored: true,
        timestamps: true,
    },
);

// Write Associations Here

export default SampleModel;
