import { ChronologicalTypeEnum } from '@app/enums/ChronologicalTypeEnum';
import { inputHelperIns } from '@app/modules/helper/InputHelper';
import { Transformer } from './Transformer';

export class MonthWiseCollectionTransformer {

    private collections: any;
    private newCollections: any;
    private collectionTransformerHandler: Transformer;
    constructor(items: object[], collectionTrans: Transformer) {
        this.collections = items;
        this.newCollections = {};
        this.collectionTransformerHandler = collectionTrans;
    }

    public transform() {

        if (inputHelperIns.isArrayValidNNotEmpty(this.collections)) {

            this.collections.forEach((item) => {

                const bookmarkedDateType = this.getBookmarkedDateType(item.entity_created_at);
                if (bookmarkedDateType.bookmarkedDateType in this.newCollections === false) {
                    this.newCollections[bookmarkedDateType.bookmarkedDateType] = { label: bookmarkedDateType.label, collection: [] };
                }
                const clonedItem = Object.assign({}, item);
                const newObj = (this.collectionTransformerHandler.doTransform(clonedItem));
                if (newObj) {
                    this.newCollections[bookmarkedDateType.bookmarkedDateType].collection.push(newObj);
                }
            });
        }
        return Object.values(this.newCollections);
    }

    private getBookmarkedDateType = (dateStr: string) => {
        const bookmarkedDate = new Date(dateStr);
        const curDate = new Date();
        let label = 'Earlier';
        let bookmarkedDateType = ChronologicalTypeEnum.EARLIER;
        if (bookmarkedDate.getMonth() === curDate.getMonth() && bookmarkedDate.getFullYear() === curDate.getFullYear()) {
            bookmarkedDateType = ChronologicalTypeEnum.THIS_MONTH;
            label = 'This Month';
        }

        if (bookmarkedDate.getMonth() === (curDate.getMonth() - 1) && bookmarkedDate.getFullYear() === curDate.getFullYear()) {
            bookmarkedDateType = ChronologicalTypeEnum.LAST_MONTH;
            label = 'Last Month';
        }
        return { bookmarkedDateType, label };
    }
}

export const monthWiseCollectionTransformerIns = (items: object[], collectionTrans: Transformer) => {
    return new MonthWiseCollectionTransformer(items, collectionTrans);
};
