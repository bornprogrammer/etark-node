import PrivateKitchenModel from './PrivateKitchenModel';

export default class PrivateKitchenRepository {

    public getType(pkId) {
        return PrivateKitchenModel.findOne({
            attributes: ['type'],
            where: {
                id: pkId,
            },
        });
    }
}

export const privateKitchenRepository = new PrivateKitchenRepository();
