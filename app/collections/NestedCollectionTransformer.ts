import { inputHelperIns } from '@app/modules/helper/InputHelper';
import { INestedTransformConfigurationEntity } from './INestedTransformConfigurationEntity';
import { Transformer } from './Transformer';
import { AppConst } from '@app/app-const/AppConst';

export class NestedCollectionTransformer implements Transformer {

    private nestedCollections: any[];
    private newNestedCollections: any;
    private loggedInUserId: any;
    constructor(collections: any[], loggedInUserId: any) {
        this.nestedCollections = collections;
        this.newNestedCollections = {};
        this.loggedInUserId = loggedInUserId;
    }

    public doTransform(transformerConf: INestedTransformConfigurationEntity[]) {
        let builtObj = this.newNestedCollections;
        if (inputHelperIns.isArrayValidNNotEmpty(this.nestedCollections) && inputHelperIns.isArrayValidNNotEmpty(transformerConf)) {
            this.nestedCollections.forEach((collectionItem) => {
                transformerConf.forEach((transformerConfItem: INestedTransformConfigurationEntity) => {

                    // tslint:disable-next-line: no-construct
                    let primaryId = collectionItem[transformerConfItem.primary_key_name];
                    primaryId = primaryId ? `id_${primaryId}` : primaryId;
                    if (primaryId !== null) {
                        if (primaryId in builtObj === false) {
                            builtObj[primaryId] = this.buildObject(collectionItem, transformerConfItem);
                        }
                        if (transformerConfItem.child_name) { // if child exists then set the child object
                            builtObj = builtObj[primaryId][transformerConfItem.child_name];
                        }
                    }
                });
                builtObj = this.newNestedCollections;
            });
            /** removing the all keys from object */
            this.newNestedCollections = Object.values(this.newNestedCollections);
            this.convertObjectToArrayRecursively(this.newNestedCollections, transformerConf, 0);
        }
        return this.newNestedCollections;
    }

    /**
     * will convert the object to array and remove the primary ids recursively
     */
    private convertObjectToArrayRecursively = (newNestedCollectionsItemArray: any, transformerConf: INestedTransformConfigurationEntity[], transformerConfItemIndex: number) => {
        if (!inputHelperIns.isArrayValidNNotEmpty(newNestedCollectionsItemArray)) {
            return;
        }
        newNestedCollectionsItemArray.forEach((newNestedCollectionsItemArrayItem) => {
            const transformerConfItem = transformerConf[transformerConfItemIndex];
            if (transformerConfItem.child_name && newNestedCollectionsItemArrayItem[transformerConfItem.child_name] instanceof Object) {
                newNestedCollectionsItemArrayItem[transformerConfItem.child_name] = Object.values(newNestedCollectionsItemArrayItem[transformerConfItem.child_name]);
                this.convertObjectToArrayRecursively(newNestedCollectionsItemArrayItem[transformerConfItem.child_name], transformerConf, transformerConfItemIndex + 1);
            }
        });
    }

    private buildObject = (collectionItem: any, transformerConfItem: INestedTransformConfigurationEntity) => {
        let builtObj = {};
        let allKeys = transformerConfItem.keys;
        allKeys = transformerConfItem.selectAll ? Object.keys(collectionItem) : allKeys;
        // if (inputHelperIns.isArrayValidNNotEmpty(allKeys) || (transformerConfItem.selectAll && allKeys)) {
        allKeys.forEach((key) => {
            builtObj[key] = collectionItem[key];
        });
        builtObj[AppConst.SESSION_USER_ID] = this.loggedInUserId;
        if (transformerConfItem.transformer) {
            builtObj = transformerConfItem.transformer.doTransform(builtObj);
        }
        if (transformerConfItem.child_name) {
            builtObj[transformerConfItem.child_name] = {};
        }
        return builtObj;
    }
}

export const nestedCollectionTransformerIns = (collections: any[], loggedInUserId: any): NestedCollectionTransformer => {
    return new NestedCollectionTransformer(collections, loggedInUserId);
};
