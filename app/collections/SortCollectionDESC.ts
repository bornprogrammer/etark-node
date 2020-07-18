import { ISortCollectionInterface } from './ISortCollectionInterface';

export class SortCollectionDESC implements ISortCollectionInterface {

    public doSort(item1: any, item2: any, keyname: any) {
        return item2[keyname] - item1[keyname];
    }
}

export const sortCollectionDESCIns = new SortCollectionDESC();
