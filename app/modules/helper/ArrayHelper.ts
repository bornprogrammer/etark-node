
 export default class ArrayHelper {

    public static arrayIterator(arr: any[], callback) {
       return arr.map(callback);
    }

    public static helper1(ipObj: any, arr, key) {

        const opArray = [];

        if (arr.length === 0) {
            throw new Error('Array length is 0');
        }
        arr.map((element) => {
            // console.log(element);
            const obj = {...ipObj};
            obj[key] = element;

            opArray.push(obj);

        });
        return opArray;
    }

    // get complement of two array
    public static complementOfArrays(arr1: any, arr2: any) {
        const diff: any = {};

        diff.notInarr2 = [];
        diff.notInarr1 = [];

        if ((arr1.length === 0) || (arr2.length === 0)) {
            return arr1 || arr2;
        }

        diff.notInarr2 = arr1.filter( function(a) {
            return !(arr2.includes(a));
        });
        diff.notInarr1 = arr2.filter( function(a) {
            return !(arr1.includes(a));
        });
        return diff;
    }
}

// ArrayHelper.helper1({custom_menu_id:2},[3,4,3], 'dishId')

// let  a = ArrayHelper.complementOfArrays([],[1,3,4,9,8,99]);
// console.log(a);

// console.log(([1,3,4] ||[]));
