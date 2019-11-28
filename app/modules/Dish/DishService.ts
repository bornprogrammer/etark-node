import BaseService from '@app/services/BaseService';

export default class DishService extends BaseService {

    constructor() {
        super();
    }

    public calculatePaginationForDishes(pageNo, recordsPerPage) {
        const retObj = {
            offset: (pageNo - 1) * recordsPerPage,
            limit : pageNo * recordsPerPage,
        };

        return retObj;
    }

}

export let dishService = new DishService();
