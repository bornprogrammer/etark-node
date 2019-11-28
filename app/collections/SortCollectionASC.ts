import { ISortCollectionInterface } from './ISortCollectionInterface';

export class SortCollectionASC implements ISortCollectionInterface {

    public doSort(item1: any, item2: any, keyname: any) {
        return item1[keyname] - item2[keyname];
    }
}

export const sortCollectionASCIns = new SortCollectionASC();
