import BaseService from '@app/services/BaseService';

export default class CustomMenuService extends BaseService {

    public seperateDishes = async (previousDishIds, newDishIds, customMenuId) => {

        const customMenuDishes = [];

        // take out the one which is in the previous one but not in the next one and put is enable for it as 0

        // for the one which are in new but not in old put is_enable as 1 and upsert

        newDishIds.forEach((element) => {
        });
    }
}

export const customMenuService =  new CustomMenuService();
