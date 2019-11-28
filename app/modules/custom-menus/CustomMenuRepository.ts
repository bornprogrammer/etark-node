import BaseRepository from '@app/repositories/BaseRepository';
import db from '../../models';
import CustomMenuDishes from './CustomMenuDishesModel';
import CustomMenuModel from './CustomMenuModel';

export default class CustomMenuRepository extends BaseRepository {

    constructor() {
        super();
    }

    public create = (attrs: any) => {
        return CustomMenuModel.create(attrs);
    }

    public addDishesToCustomMenu(arr: any) {
        return CustomMenuDishes.bulkCreate(arr);
    }

    // gets the count
    public getCustomMenuCount(buddyId: number) {
        return CustomMenuModel.count({
            where: {
                buddy_id: buddyId,
            },
        });
    }

    // edit basic details about a custom menu
    public editCustomMenu(obj: any) {
        return CustomMenuModel.update({
            name: obj.name,
            description: obj.description,
        }, {
                where: {
                    id: obj.id,
                },
            });
    }

    // get dishes of custom menu
    public getDishes(customMenuId: number) {
        return CustomMenuDishes.findAll({
            attributes: ['dishId', 'isEnable'],
            where: {
                customMenuId,
                isEnable: 1,
            }, raw: true,
        });
    }

    // enable or disable the dish id for the custom menu
    // public enableDish(obj: any) {
    //     return CustomMenuDishes.upsert()
    // }

    public disableDish(obj: any) {
        return CustomMenuModel.update({

        });
    }

    // edit name and description of the dish
    public editBasicDishDetails(obj: any) {
        return CustomMenuModel.update({
            name: obj.name,
            description: obj.description,
        }, {
                where: { id: obj.id },
            });
    }

    public editCustomMenuDishes(data: any) {
        return CustomMenuDishes.bulkCreate(data,
            {
                fields: ['customMenuId', 'dishId', 'isEnable'],
                updateOnDuplicate: ['isEnable'],
            });
    }

}

export const customMenuRepository = new CustomMenuRepository();

// customMenuRepository.getDishes(84).then((d) => console.log(d)).catch(e => console.log(e))

// customMenuRepository.editCustomMenuDishes([{customMenuId:84,dishId:226880,isEnable:0},{customMenuId:84,dishId:34865,isEnable:1}]).then((d) => console.log(d)).catch(e => console.log(e))
