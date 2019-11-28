import BaseRepositoryService from '@app/services/BaseRepositoryService';
import Logger from '@app/services/Logger';
import CustomMenuRepository from './CustomMenuRepository';
import { customMenuRepository } from './CustomMenuRepository';
import ICustomMenu from './ICustomMenu';

import ErrorFactory from '@app/errors/ErrorFactory';
import { customMenuService } from '@app/modules/custom-menus/CustomMenuService';
import  ArrayHelper  from '@app/modules/helper/ArrayHelper';
import ObjectHelper from '@app/modules/helper/ObjectHelper';
import BaseRepository from '@app/repositories/BaseRepository';

export default class CustomMenuRepositoryService extends BaseRepositoryService {
    private customMenuService  = customMenuService;

    public constructor(customMenuRepository: CustomMenuRepository) {
        super(customMenuRepository);
    }
    public create = async (obj: any) => {

        const createCustomMenuObject: any = ObjectHelper.extractKeyAndValFromObj(obj, { name: 'name', description: 'description', userId: 'buddyId' });
        const dishes: any = ObjectHelper.extractKeyAndValFromObj(obj, { dishIds: 'dishIds' });
        let customMenu, addDishes;
        try {
            customMenu = await this.createCustomMenu(createCustomMenuObject);
            addDishes = await this.addDishToCustomMenu(dishes.dishIds, customMenu.id);
            return customMenu;

        } catch (error) {
            throw Error(error);
        }
    }

    public editBasicDetails = async (obj) => {
        const customMenu: any = ObjectHelper.extractKeyAndValFromObj(obj, { name: 'name', description: 'description', custom_menu_id: 'id' });
        const dishes: any = ObjectHelper.extractKeyAndValFromObj(obj, { custom_menu_id: 'id', dishIds: 'dishIds' });

        // update the basic details of the custom menu
        try {
            const customMenuUpdated  = await this.mRepository.editBasicDishDetails(obj);
        } catch (error) {
            throw new ErrorFactory(error);
        }
    }

    public updateDishOfCustomMenu = async (obj) => {
        // get the enabled dishes in custom menu
        try {
            const oldDishes = await this.mRepository.getDishes(obj);
            // call the function to seperate out the dish ids
            // customMenuService.seperateDishes(oldDishes, obj.dishes)

        } catch (error) {
            throw new ErrorFactory(error);
        }

    }

    private createCustomMenu = async (obj: ICustomMenu) => {
        const customMenu = await this.mRepository.create(obj);
        return customMenu;
    }

    private addDishToCustomMenu = async (dishIds: any, customMenuId) => {
        if (dishIds.length === 0) {
            throw Error('Dish ids not sent');
        }

        const newCustomMenuDishes =  ArrayHelper.helper1({customMenuId}, dishIds, 'dishId');

        const addDishes = await this.mRepository.addDishesToCustomMenu(newCustomMenuDishes);
        return addDishes;
    }

}

export const customMenuRepositoryService = new CustomMenuRepositoryService(customMenuRepository);
