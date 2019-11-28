
import ErrorFactory from '@app/errors/ErrorFactory';
import DishRepository, { dishRepository } from '@app/modules/Dish/DishRepository';
import { dishService } from '@app/modules/Dish/DishService';
import ArrayHelper from '@app/modules/helper/ArrayHelper';
import ObjectHelper from '@app/modules/helper/ObjectHelper';
import BaseRepositoryService from '@app/services/BaseRepositoryService';

export default class DishRepositoryService extends BaseRepositoryService {

    private dishService = dishService;

    constructor(dishRepository: DishRepository ) {
        super(dishRepository);
    }

    public buddyDishes = async (obj) => {
        const offsets = dishService.calculatePaginationForDishes(obj.pageNo, 10);
        try {
            const dishes = await this.mRepository.buddyDishes(obj.userId);
        } catch (error) {
            throw new ErrorFactory(error);
        }
    }

}

export let dishRepositoryService = new DishRepositoryService(dishRepository);
// dishRepositoryService.buddyDishes({buddyId:385,pageNo:1}).then((d:any) => console.log(d)).catch(e =>console.log(e));
