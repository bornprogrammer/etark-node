import { inputHelperIns } from '@app/modules/helper/InputHelper';
import { Transformer } from './Transformer';

export class CollectionTransformer {

    private collectionTransformerHandler: Transformer;
    private collection: object[];
    private loggedInUserId: any;
    public constructor(collection: object[], collectionTrans: Transformer, loggedInUserId: any) {
        this.collection = collection;
        this.collectionTransformerHandler = collectionTrans;
        this.loggedInUserId = loggedInUserId;
        return this;
    }

    public transform() {

        if (inputHelperIns.isArrayValidNNotEmpty(this.collection)) {
            this.collection.forEach((item: any) => {
                item.session_user_id = this.loggedInUserId;
                this.collectionTransformerHandler.doTransform(item);
            });
        }
    }
}

export const collectionTransformerIns = (collection: object[], collectionTrans: Transformer, loggedInUserId: any) => {
    return new CollectionTransformer(collection, collectionTrans, loggedInUserId);
};
