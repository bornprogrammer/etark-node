import { sequelize } from '@app/config/DatabaseService';
import CustomMenuDishes from '@app/modules/custom-menus/CustomMenuDishesModel';
import DishModel from '@app/modules/Dish/DishModel';
import UserModel from '@app/modules/User/UserModel';
import BaseRepository from '@app/repositories/BaseRepository';

export default class DishRepository extends BaseRepository {

    // public buddyDishes(buddyId){
    //     return DishModel.findAll({
    //         attributes:['id','name','description','dishType','dishContent','cost','is_enable','level','bookmarks'],
    //         include:[{
    //             model:CustomMenuDishes
    //         }],
    //         where:{
    //             buddyId:buddyId,
    //             isDeleted:0,

    //         }
    //     })
    // }

    public buddyDishes(buddyId) {
        return DishModel.findAll({
            attributes: ['id', 'buddy_id', 'name', 'description', 'dishType',
                'dishContent', 'cost', 'is_enable', 'level', 'bookmarks',
                [sequelize.fn('count', sequelize.col('custom_menu_dishes.id')), 'custom_menu_count']],
            include:
                [{
                    model: UserModel, required: true, attributes: ['name'],
                },
                {
                    model: CustomMenuDishes, attributes: [],
                }],
            group: ['dishes.id'],
            where: { buddyId }, raw: true,
        });
    }

    // public buddyDishes(buddyId,offset,limit){
    //     return DishModel.findAll({attributes:['id','buddy_id','name','description','dishType',
    //     'dishContent','cost','is_enable','level','bookmarks',
    //     [sequelize.fn('count', sequelize.col('custom_menu_dishes.id')), 'custom_menu_count']],
    //     include:
    //     [{
    //         model:UserModel,required:true, attributes:['name']},
    //     {
    //         model:CustomMenuDishes, attributes:[]
    //     }],

    //      where:{buddyId:buddyId},group:['dishes.id'],raw:true, offset:offset,limit:limit})
    // }

}

export const dishRepository = new DishRepository;

dishRepository.buddyDishes(385).then((d: any) => d).catch((e) => console.log(e));
