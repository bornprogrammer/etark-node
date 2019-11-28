import { sequelize } from '@app/config/Sequelize';
import ErrorFactory from '@app/errors/ErrorFactory';
import { TokenNotSentError } from '@app/errors/TokenNotSentError';
import { Sequelize } from 'sequelize';
import { userSessionRepository } from '../User/UserSessionRepository';

export class EventModel {
    private sequelizeCon: Sequelize;
    private aws = 'https://foodybuddyrik.s3-ap-southeast-1.amazonaws.com/uploads';
    constructor() {
        this.sequelizeCon = sequelize;
    }

    public getCookingClassById = async (obj: any) => {
        try {
            // tslint:disable-next-line: radix
            const query = `select i.id as item_id, i.title, i.description, i.price as unit_price,
            i.total_availability,i.remaining_availability, il.id as item_lookup_id,
            il.type as item_lookup_type,il.name as item_lookup_name,
            el.locality,CONCAT("Upto ",el.duration) as duration,CONCAT("Offered in ",el.language) as language,
            u.name as buddy_name,u.id as buddy_id,
            IF(u.profile,CONCAT('${this.aws}','/profile/',u.profile),null) as buddy_profile, u.followers_count,
            IFNULL((select sum(ordered_units)
                   from orders o left join dishes d on d.id=o.dish_id where d.buddy_id=u.id and order_status='completed'),0) AS buddy_completed_orders,
                       DATE_FORMAT(i.start_time,"%l:%i%p, %D %b %Y") as start_time, i.start_time as actual_start_time,
                        el.location_details, el.lat, el.lng, 
                       IFNULL((select CAST(CONCAT('[',	
                               GROUP_CONCAT(JSON_OBJECT(
                               'image',CONCAT('${this.aws}','/event/',im.image),
                               'image_id',im.id
                             ))
                               ,']') as JSON) as details from item_images im where im.item_id=i.id group by item_id),CAST('[]' as JSON)) as images,
                       IFNULL((CAST(CONCAT('[',
                               GROUP_CONCAT(JSON_OBJECT(
                               'title',itlu.name,
                               'type',itlu.type,
                               'image',CONCAT('${this.aws}','/event/',itlu.image),
                               'details',id.description
                             ))
                               ,']') as JSON)),CAST('[]' as JSON)) as event_details
                                from items i
                        left join event_locations el on el.item_id=i.id
                        left join item_details id on id.item_id=i.id
                        left join item_lookup il on i.item_look_up_id=il.id
                        left join users u on u.id=i.user_id
                        left join item_title_look_up itlu on itlu.id=id.item_title_look_id
                            where i.id=${obj.eventId} and i.is_deleted=0 and
                            i.is_enabled=1 and i.city_id=${obj.cityId} and
                            SUBTIME(i.start_time,"12:00:00")>CONVERT_TZ(now(),'+00:00','+05:30') and
                            el.is_deleted=0 and il.type='cooking_class' and
                            itlu.is_deleted=0 and itlu.is_enabled=1 and
                            id.is_deleted=0 and id.is_enabled=1`;
            const result = await this.sequelizeCon.query(query);
            return result[0][0].item_id ? result[0][0] : [];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new Error(error);
        }
    }

    public getCarouselEvents = async (obj: any) => {
        try {
            // tslint:disable-next-line: radix
            const query = `select i.id as item_id,i.title,i.description,
            CONCAT('${this.aws}','/event/',ib.image) as banner_image,
            ib.color_code,u.name as buddy_name, u.id as buddy_id,
            il.id as item_lookup_id,il.name as item_lookup_name,
            il.type as item_lookup_type from item_banner ib
            inner join items i on i.id =ib.item_id
            inner join item_lookup il on il.id=i.item_look_up_id
            inner join users u on u.id=i.user_id
            where i.is_deleted=0 and i.is_enabled=1 and
            DATE(i.start_time)>CURDATE() and i.city_id=${obj.cityId} and
            il.is_enable=1 and ib.is_deleted=0 and ib.is_enabled=1`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new Error(error);
        }
    }

    public getCuratedProductsById = async (obj: any) => {
        try {
            // tslint:disable-next-line: radix
            const query = `select i.id as item_id, i.title, i.description, i.price as unit_price, i.total_availability,i.remaining_availability,
il.type as item_lookup_type,il.id as item_lookup_id,il.name as item_lookup_name,u.name as buddy_name,u.id as buddy_id,
CONCAT('${this.aws}','/event/',ib.image) as thumb_image,
CONCAT('Will be shipped by ',DATE_FORMAT(i.delivery_date,"%D %b %Y")) as delivery_date,
IF(u.profile,CONCAT('${this.aws}','/profile/',u.profile),null) as buddy_profile, u.followers_count,
IFNULL((select sum(ordered_units)
       from orders o left join dishes d on d.id=o.dish_id where d.buddy_id=u.id and order_status='completed'),0) AS buddy_completed_orders,
       CONCAT('order by ',DATE_FORMAT(i.end_time,"%D %b %Y")) as end_time,i.end_time as actual_end_time,
           IFNULL((select CAST(CONCAT('[',	
                   GROUP_CONCAT(JSON_OBJECT(
                   'image',CONCAT('${this.aws}','/event/',im.image),
                   'image_id',im.id
                 ))
                   ,']') as JSON) as details from item_images im where im.item_id=i.id group by item_id),CAST('[]' as JSON)) as images,
           IFNULL((CAST(CONCAT('[',
                   GROUP_CONCAT(JSON_OBJECT(
                   'title',itlu.name,
                   'type',itlu.type,
                   'image',CONCAT('${this.aws}','/event/',itlu.image),
                   'details',id.description
                 ))
                   ,']') as JSON)),CAST('[]' as JSON)) as event_details
                    from items i
            left join item_details id on id.item_id=i.id and
            id.is_deleted=0 and id.is_enabled=1 
            left join item_title_look_up itlu  on itlu.id=id.item_title_look_id
            left join item_lookup il on i.item_look_up_id=il.id
            left join users u on u.id=i.user_id
            left join item_banner ib on ib.item_id=i.id
            and ib.is_enabled=1 and ib.is_deleted=0
                where i.id=${obj.eventId} and i.is_deleted=0 and
                i.is_enabled=1 and i.city_id=${obj.cityId} and
                itlu.is_deleted=0 and itlu.is_enabled=1 and
                DATE(i.end_time)>=CURDATE() and il.type='curated_products'`;
            const result = await this.sequelizeCon.query(query);
            return result[0][0].item_id ? result[0][0] : [];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new Error(error);
        }
    }

    public getCookingClassList = async (obj: any) => {
        try {
            // tslint:disable-next-line: radix
            const query = `select i.id as item_id, i.title, i.description, i.price as unit_price,
            i.total_availability,i.remaining_availability, il.id as item_lookup_id,
            CONCAT('${this.aws}','/event/',ib.image) as thumb_image,
            il.type as item_lookup_type,il.name as item_lookup_name,
            el.locality,el.duration,el.language,
            u.name as buddy_name,u.id as buddy_id,
            IF(u.profile,CONCAT('${this.aws}','/profile/',u.profile),null) as buddy_profile, u.followers_count,
            IFNULL((select sum(ordered_units)
                   from orders o left join dishes d on d.id=o.dish_id where d.buddy_id=u.id and order_status='completed'),0) AS buddy_completed_orders,
                       DATE_FORMAT(i.start_time,"%l:%i%p, %D %b %Y") as start_time,i.start_time as actual_start_time
                                from items i 
                        left join event_locations el on el.item_id=i.id
                        left join item_lookup il on i.item_look_up_id=il.id
                        left join item_banner ib on ib.item_id=i.id
                        and ib.is_enabled=1 and ib.is_deleted=0
                        left join users u on u.id=i.user_id
                            where i.is_deleted=0 and
                            i.is_enabled=1 and i.city_id=${obj.cityId} and
                            SUBTIME(i.start_time,"12:00:00")>CONVERT_TZ(now(),'+00:00','+05:30') and
                            el.is_deleted=0 and il.type='cooking_class'`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new Error(error);
        }
    }

    public getCuratedProductList = async (obj: any) => {
        try {
            // tslint:disable-next-line: radix
            const query = `select i.id as item_id,i.is_new, i.title, i.description, i.price as unit_price, i.total_availability,i.remaining_availability,
            CONCAT('order by ',DATE_FORMAT(i.end_time,"%D %b %Y")) as end_time,i.end_time as actual_end_time,CONCAT('${this.aws}','/event/',ib.image) as thumb_image,
 il.type as item_lookup_type,il.id as item_lookup_id,il.name as item_lookup_name,u.name as buddy_name,u.id as buddy_id,
 i.item_category_id,ic.name as category_name,
 IF(u.profile,CONCAT('${this.aws}','/profile/',u.profile),null) as buddy_profile, u.followers_count,
 IFNULL((select sum(ordered_units)
        from orders o left join dishes d on d.id=o.dish_id where d.buddy_id=u.id and order_status='completed'),0) AS buddy_completed_orders
                     from items i
                     inner join item_lookup il on il.id=i.item_look_up_id
                     inner join item_category ic on ic.id=i.item_category_id
                     left join item_banner ib on ib.item_id=i.id
                     and ib.is_enabled=1 and ib.is_deleted=0
             left join users u on u.id=i.user_id
                 where i.is_deleted=0 and
                 i.is_enabled=1 and i.city_id=${obj.cityId} and
                 DATE(i.end_time)>=CURDATE() and il.type='curated_products' 
                 ${obj.category_id ? `and ic.id=${obj.category_id}` : ''} 
                 ${obj.page ? `limit 20 offset ${((obj.page > 0 ? obj.page : 1) - 1) * 20}` : ''}`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new Error(error);
        }
    }

    public getCookingClassBanner = async (obj: any) => {
        try {
            // tslint:disable-next-line: radix
            const query = `select ib.id as banner_id,il.item_title as title,
            il.item_description as description,CONCAT('${this.aws}','/event/',ib.image) as banner_image,
            CONCAT('${this.aws}','/event/',ib.image) as cover_image,
            il.id as item_lookup_id,il.type,il.name,ib.color_code,
            (select count(*) from items si where si.item_look_up_id=i.item_look_up_id) as total_events
            from item_banner ib
            inner join items i on i.id=ib.item_id
            inner join item_lookup il on il.id=i.item_look_up_id
            where il.type='cooking_class' and i.is_deleted=0 and i.is_enabled=1
            and ib.is_deleted=0 and ib.is_enabled=1 and i.city_id=${obj.cityId} and
            SUBTIME(i.start_time,"12:00:00")>CONVERT_TZ(now(),'+00:00','+05:30') and
            il.is_enable=1 order by RAND() limit 1`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new Error(error);
        }
    }

    public getCuratedBanner = async (obj: any) => {
        try {
            // tslint:disable-next-line: radix
            const query = `select ib.id as banner_id,il.item_title as title,il.item_description as description,
            il.id as item_lookup_id,il.type,il.name,ib.color_code,
            CONCAT('${this.aws}','/event/',ib.image) as banner_image,
            CONCAT('${this.aws}','/event/',ib.image) as cover_image,
            (select count(*) from items si where si.item_look_up_id=i.item_look_up_id) as total_events
            from item_banner ib
            inner join items i on i.id=ib.item_id
            inner join item_lookup il on il.id=i.item_look_up_id
            where il.type='curated_products' and i.is_deleted=0 and i.is_enabled=1
            and ib.is_deleted=0 and ib.is_enabled=1 and i.city_id=${obj.cityId} and
            DATE(i.end_time)>=CURDATE() and il.is_enable=1 order by RAND() limit 1`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new Error(error);
        }
    }

    public getDishTionaryBanner = async () => {
        try {
            const sql = `select m.id as banner_id, m.title,m.description,0 as item_lookup_id,m.type,m.title as name,
            "#058d8f" as color_code,
            CONCAT('${this.aws}','/gallery/',m.image) as banner_image,
            CONCAT('${this.aws}','/gallery/',m.image) as cover_image,
            (select SUM(reward_amount) as reward_amount
            from fb_conversations_participants_quest
            where is_active=1 and CURDATE() >= start_date and CURDATE() <= end_date) as reward_amount
            from marketing as m
            where m.is_active=1 and m.user_type in ('FOODY','BOTH') and m.type='dish_tionary'`;
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    public getCookingClassPastOrders = async (obj) => {
        try {
            // tslint:disable-next-line: radix
            const query = `select i.id as item_id,i.title,i.description,
            CONCAT('${this.aws}','/event/',ib.image) as banner_image,
            DATE_FORMAT(i.start_time,"%l:%i%p, %D %b %Y") as start_time,
            el.locality,ct.ordered_unit,ct.net_cost as grand_total,el.lat,el.lng,
            u.name as buddy_name,u.phone as buddy_phone
            from cart_v1 cv
            INNER JOIN cart_item ct ON ct.cart_id=cv.id
            INNER JOIN order_v1 ov on ov.cart_id=cv.id
            and ov.status in ('confirmed','completed')
            INNER JOIN items i on i.id=ct.item_id
            INNER JOIN item_lookup il on il.id=i.item_look_up_id
            and il.type="cooking_class"
            LEFT JOIN item_banner ib on ib.item_id=i.id
            LEFT JOIN event_locations el on el.item_id=i.id
            LEFT JOIN users u on u.id=i.user_id
            where cv.user_id=${obj.userId} and i.start_time<now()
            and cv.is_enable=1 and ct.is_enabled=1 and ct.is_deleted=0
            order by i.id desc`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new Error(error);
        }
    }

    public getCuratedProductPastOrders = async (obj) => {
        try {
            // tslint:disable-next-line: radix
            const query = `select i.id as item_id,i.title,i.description,
            DATE_FORMAT((DATE_ADD(i.delivery_date,INTERVAL 4 DAY)),"%D %b %Y") as end_time,
            CONCAT('${this.aws}','/event/',ib.image) as thumb_image,
            ct.ordered_unit,ct.net_cost as grand_total,'delivered' as status
            from cart_v1 cv
            INNER JOIN cart_item ct ON ct.cart_id=cv.id
            INNER JOIN order_v1 ov on ov.cart_id=cv.id
            and ov.status in ('confirmed','completed')
            INNER JOIN items i on i.id=ct.item_id
            INNER JOIN item_lookup il on il.id=i.item_look_up_id
            and il.type='curated_products'
            LEFT JOIN item_banner ib on ib.item_id=i.id
            where cv.user_id=${obj.userId} and DATE_ADD(i.delivery_date,INTERVAL 5 DAY)<now()
            and cv.is_enable=1 and ct.is_enabled=1 and ct.is_deleted=0
            order by i.id desc`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new Error(error);
        }
    }

    public getCookingClassUpcomingOrders = async (obj) => {
        try {
            // tslint:disable-next-line: radix
            const query = `select i.id as item_id,i.title,i.description,
            CONCAT('${this.aws}','/event/',ib.image) as banner_image,
            DATE_FORMAT(i.start_time,"%l:%i%p, %D %b %Y") as start_time,
            el.locality,ct.ordered_unit,ct.net_cost as grand_total,el.lat,el.lng,
            u.name as buddy_name,u.phone as buddy_phone
            from cart_v1 cv
            INNER JOIN cart_item ct ON ct.cart_id=cv.id
            INNER JOIN order_v1 ov on ov.cart_id=cv.id
            and ov.status in ('confirmed','completed')
            INNER JOIN items i on i.id=ct.item_id
            INNER JOIN item_lookup il on il.id=i.item_look_up_id
            and il.type="cooking_class"
            LEFT JOIN item_banner ib on ib.item_id=i.id
            LEFT JOIN event_locations el on el.item_id=i.id
            LEFT JOIN users u on u.id=i.user_id
            where cv.user_id=${obj.userId} and i.start_time>now()
            and cv.is_enable=1 and ct.is_enabled=1 and ct.is_deleted=0
            order by i.id desc`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new Error(error);
        }
    }

    public getCuratedProductUpcomingOrders = async (obj) => {
        try {
            // tslint:disable-next-line: radix
            const query = `select i.id as item_id,i.title,i.description,
            DATE_FORMAT((DATE_ADD(i.delivery_date,INTERVAL 4 DAY)),"%D %b %Y") as end_time,
            CONCAT('${this.aws}','/event/',ib.image) as thumb_image,
            ct.ordered_unit,ct.net_cost as grand_total,
            (CASE WHEN now()>delivery_date THEN 'shipped' ELSE 'confirmed' END) as status
            from cart_v1 cv
            INNER JOIN cart_item ct ON ct.cart_id=cv.id
            INNER JOIN order_v1 ov on ov.cart_id=cv.id
            and ov.status in ('confirmed','completed')
            INNER JOIN items i on i.id=ct.item_id
            INNER JOIN item_lookup il on il.id=i.item_look_up_id
            and il.type='curated_products'
            LEFT JOIN item_banner ib on ib.item_id=i.id
            where cv.user_id=${obj.userId} and DATE_ADD(i.delivery_date,INTERVAL 5 DAY)>=now()
            and cv.is_enable=1 and ct.is_enabled=1 and ct.is_deleted=0
            order by i.id desc`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new Error(error);
        }
    }

    public getBookedEventsCount = async (obj) => {
        try {
            // tslint:disable-next-line: radix
            const query = `select IFNULL((select count(ct.it)
            from cart_v1 cv
            INNER JOIN cart_item ct ON ct.cart_id=cv.id
            INNER JOIN order_v1 ov on ov.cart_id=cv.id and ov.status in ('confirmed','completed')
            INNER JOIN items i on i.id=ct.item_id
            INNER JOIN item_lookup il on il.id=i.item_look_up_id
            and il.type="curated_products"
            where cv.user_id=${obj.userId} and cv.is_enable=1 and 
            ct.is_enabled=1 and ct.is_deleted=0 and 
            DATE_ADD(i.delivery_date,INTERVAL 5 DAY)>=now()),0) as curated_products,
            IFNULL((select count(ov.id) from cart_v1 cv
            INNER JOIN cart_item ct ON ct.cart_id=cv.id
            INNER JOIN order_v1 ov on ov.cart_id=cv.id and ov.status in ('confirmed','completed')
            INNER JOIN items i on i.id=ct.item_id
            INNER JOIN item_lookup il on il.id=i.item_look_up_id
            and il.type="cooking_class"
           	where cv.user_id=${obj.userId} and i.start_time>now()),0) as cooking_classes`;
            const result = await this.sequelizeCon.query(query);
            return result[0][0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new Error(error);
        }
    }

    public goodiesAllCategories = async (obj) => {
        try {
            // tslint:disable-next-line: radix
            const query = `select category_name,item_category_id,CAST(CONCAT('[',
            GROUP_CONCAT(JSON_OBJECT(
            'item_id',item_id,
            'title',title,
            'description',description,
            'item_category_id',item_category_id,
            'category_name',category_name,
            'unit_price',unit_price,
            'total_availability',total_availability,
            'remaining_availability',remaining_availability,
            'end_time',end_time,
            'actual_end_time',actual_end_time,
            'thumb_image',thumb_image,
            'item_lookup_type',item_lookup_type,
            'item_lookup_id',item_lookup_id,
            'item_lookup_name',item_lookup_name,
            'buddy_name',buddy_name,
            'buddy_id',buddy_id,
            'buddy_profile',buddy_profile,
            'followers_count',followers_count,
            'buddy_completed_orders',buddy_completed_orders,
            'is_new', is_new
          ))
            ,']') as JSON) as goodies from (select i.id as item_id,i.is_new, i.title, i.description,i.item_category_id,
                ic.name as category_name, i.price as unit_price, i.total_availability,i.remaining_availability,
        CONCAT('order by ',DATE_FORMAT(i.end_time,"%D %b %Y")) as end_time,i.end_time as actual_end_time,
        CONCAT('${this.aws}','/event/',ib.image) as thumb_image,
        il.type as item_lookup_type,il.id as item_lookup_id,il.name as item_lookup_name,u.name as buddy_name,u.id as buddy_id,
        IF(u.profile,CONCAT('${this.aws}','/profile/',u.profile),null) as buddy_profile, u.followers_count,
        IFNULL((select sum(ordered_units) from orders o 
        left join dishes d on d.id=o.dish_id where d.buddy_id=u.id and order_status='completed'),0) AS buddy_completed_orders
        from items i 
        inner join item_lookup il on il.id=i.item_look_up_id
        inner join item_category ic on ic.id=i.item_category_id
        left join item_banner ib on ib.item_id=i.id 
        and ib.is_enabled=1 and ib.is_deleted=0
        left join users u on u.id=i.user_id
        where i.is_deleted=0 and 
        i.is_enabled=1 and i.city_id=${obj.cityId} and
        DATE(i.end_time)>=CURDATE() and il.type='curated_products') as temp group by temp.item_category_id 
        limit 3 offset ${((obj.page ? obj.page : 1) - 1) * 3}`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new Error(error);
        }
    }

    public getCategoryList = async (obj) => {
        try {
            // tslint:disable-next-line: radix
            const query = `select DISTINCT(ic.id) as category_id,ic.name from items i
            INNER JOIN item_lookup il on il.id=i.item_look_up_id
            INNER JOIN item_category ic on ic.id=i.item_category_id
            where i.is_deleted=0 and 
            i.is_enabled=1 and i.city_id=${obj.cityId} and
            DATE(i.end_time)>=CURDATE() and il.type='curated_products'
            order by order_id ASC`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new Error(error);
        }
    }

    public getActiveQuest = async (obj) => {
        try {
            // tslint:disable-next-line: radix
            const query = `select group_concat(q.id) as foody_quest_ids,SUM(r.reward_monetary_val) as reward_amount from foody_quest as q
            inner join foody_user_quest_completed as qc on qc.foody_quest_id=q.id and qc.user_id=${obj.userId}
            inner join foody_quest_reward as fqr on fqr.foody_quest_id=q.id
            inner join reward as r on fqr.reward_id=r.id and r.is_active=1
            inner join reward_lookup as rl on r.reward_lookup_id=rl.id
            where q.is_active=1 and  CURDATE() BETWEEN q.start_date and q.end_date
            LIMIT 1`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new Error(error);
        }
    }
}

export const eventModelIns = new EventModel();