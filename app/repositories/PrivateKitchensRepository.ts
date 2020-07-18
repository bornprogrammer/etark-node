import db from '@app/models';

export class PrivateKitchensRepository {

    public maxId = () => {
        return db.PrivateKitchen.max('id');
    }

    public findAllUserIdsBetweenIds = (startId, endId) => {
        return db.PrivateKitchen.findAll({
            where: {
                id: {
                    [db.Sequelize.Op.between]: [startId, endId],
                },
            },
            attributes: [
                'createdBy',
            ],
        });
    }

    public findAllPksWithBlankStatus = () => {
        return db.PrivateKitchen.findAll({
            where: {
                status: '',
            },
        });
    }

}
