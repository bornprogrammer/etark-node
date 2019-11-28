import { sequelize } from '@app/config/Sequelize';
import ErrorFactory from '@app/errors/ErrorFactory';
import { TokenNotSentError } from '@app/errors/TokenNotSentError';
import { Sequelize } from 'sequelize';
import { userSessionRepository } from '../User/UserSessionRepository';

export class HubLevelModel {
    private sequelizeCon: Sequelize;
    private aws = 'https://foodybuddyrik.s3-ap-southeast-1.amazonaws.com/uploads';
    constructor() {
        this.sequelizeCon = sequelize;
    }

    public getUserAddedHubs = async (obj: any) => {
        try {
            // tslint:disable-next-line: radix
            const offset = (parseInt(obj.page) - 1) * 20;
            const query = `select h.id as hub_id,uh.id as user_hub_id,h.name as hub_name,
            IFNULL(hlt.type,'new') as hub_level_type,
            IF(hlt.type is not null,CONCAT('${this.aws}','/icons/',hlt.img_url),CONCAT('${this.aws}','/icons/New.png')) as hub_level_image,
             (select count(*) from
            user_hub where hub_id=h.id and type in ('FOODY','BOTH') and status not in
            ('BLOCK','PRIVATE_KITCHEN')) as buyers_count from user_hub as uh inner join hub as h on
            uh.hub_id=h.id and h.is_deleted=0 inner join secondary_hub_transaction sht on
            sht.user_hub_id=uh.id and sht.is_occupied=1 left join hub_level hl on hl.hub_id=h.id
            and hl.is_active=1 left join
            hub_level_type hlt on hlt.id=hl.hub_level_type_id where uh.type='BUDDY' and
            uh.status='VERIFIED' and h.type not in ('private_kitchen','office')
            and uh.user_id=${obj.userId} group by h.id order by h.name limit ${offset}, 20`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public getUserAddedHubsCount = async (obj: any) => {
        try {
            // tslint:disable-next-line: radix
            const query = `select IFNULL(count(h.id),0) as total_count from user_hub as uh inner join hub as h on
            uh.hub_id=h.id and h.is_deleted=0 inner join secondary_hub_transaction sht on
            sht.user_hub_id=uh.id and sht.is_occupied=1 where uh.type='BUDDY' and
            uh.status='VERIFIED' and h.type not in ('private_kitchen','office') and uh.user_id=${obj.userId}`;
            const result = await this.sequelizeCon.query(query);
            return result[0][0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public getAdminAddedHubs = async (obj: any) => {
        try {
            const query = `select h.id as hub_id,uh.id as user_hub_id,h.name as hub_name,
            IFNULL(hlt.type,'new') as hub_level_type,
            IF(hlt.type is not null,CONCAT('${this.aws}','/icons/',hlt.img_url),CONCAT('${this.aws}','/icons/New.png')) as hub_level_image,
             (select count(*)
            from user_hub where hub_id=h.id and type in ('FOODY','BOTH') and status not in
            ('BLOCK','PRIVATE_KITCHEN')) as buyers_count from user_hub as uh inner join hub as
            h on uh.hub_id=h.id and h.is_deleted=0 LEFT JOIN secondary_hub_transaction sht on
            sht.user_hub_id=uh.id AND sht.is_occupied=1 left join hub_level hl on hl.hub_id=h.id
            and hl.is_active=1
            left join hub_level_type hlt on hlt.id=hl.hub_level_type_id where uh.type='BUDDY' and
            uh.status='VERIFIED' and h.type not in ('private_kitchen','office') and uh.user_id=${obj.userId} AND sht.id
            is null group by h.id order by h.name limit ${(parseInt(obj.page) - 1) * 20}, 20`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public getAdminAddedHubsCount = async (obj: any) => {
        try {
            const query = `select IFNULL(count(h.id),0) as total_count from user_hub as uh inner join hub as
            h on uh.hub_id=h.id and h.is_deleted=0 LEFT JOIN secondary_hub_transaction sht on
            sht.user_hub_id=uh.id AND sht.is_occupied=1 where uh.type='BUDDY' and
            uh.status='VERIFIED' and h.type not in ('private_kitchen','office') and uh.user_id=${obj.userId} AND sht.id
            is null`;
            const result = await this.sequelizeCon.query(query);
            return result[0][0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public getHubMetadata = async (obj: any) => {
        try {
            const query = `select count(hub_id) as hub_count,CAST(sum((select count(*) from
            user_hub where hub_id = uh.hub_id and type in ('FOODY','BOTH') and status not in
            ('BLOCK','PRIVATE_KITCHEN'))) as SIGNED) as total_user_count from user_hub uh
            INNER JOIN hub as h on h.id=uh.hub_id and h.type not in ('private_kitchen','office') where
            uh.user_id=${obj.userId} and uh.status='VERIFIED' and uh.type in ('both','buddy')`;
            const result = await this.sequelizeCon.query(query);
            return result[0][0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public getUserPrimaryHubs = async (userId: string) => {
        try {
            const query = `select h.id as hub_id,uh.id as user_hub_id,h.name as hub_name,
            IFNULL(hlt.type,'new') as hub_level_type,
			IF(hlt.type is not null,CONCAT('${this.aws}','/icons/',hlt.img_url),CONCAT('${this.aws}','/icons/New.png')) as hub_level_image,
            (select count(*) from user_hub where hub_id=h.id and type in ('FOODY','BOTH') and
            status not in ('BLOCK','PRIVATE_KITCHEN')) as buyers_count
            from user_hub as uh
            inner join hub as h on uh.hub_id=h.id and h.is_deleted=0
            left join hub_level hl on hl.hub_id=h.id and hl.is_active=1
            left join hub_level_type hlt on hlt.id=hl.hub_level_type_id
            where uh.type='BOTH' and uh.status='VERIFIED'
            and uh.user_id=${userId} group by h.id`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public getHubSlotChallenges = async (userId: string) => {
        try {
            const query = `select sc.task_id,sc.order,t.task_name,t.description,IF(stuc.id,1,0)
            as is_completed from slot_challenge as sc
            inner join task as t on sc.task_id=t.id
            LEFT JOIN slot_track_user_challenge as stuc on stuc.slot_challenge_id=sc.id and
            stuc.user_id=${userId} order by sc.order`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public getUserPrivateKitchenHubs = async (obj: any) => {
        try {
            const query = `select h.id as hub_id,h.name as hub_name,
            (select count(*) from private_kitchen_users spku inner join
                user_hub suh on suh.user_id=spku.user_id where spku.is_deleted=0 and spku.is_active_member=1
                and suh.type in ('BOTH','FOODY') and suh.status not in ('block','private_kitchen')
                and suh.hub_id=pkh.hub_id and spku.private_kitchen_id=pk.id) as buyers_count,
                IFNULL(hlt.type,'new') as hub_level_type,
                IF(hlt.type is not null,CONCAT('${this.aws}','/icons/',hlt.img_url),CONCAT('${this.aws}','/icons/New.png')) as hub_level_image from private_kitchens pk
            left join private_kitchen_hubs pkh on pkh.private_kitchen_id=pk.id
            left join hub h on h.id=pkh.hub_id
            left join hub_level hl on hl.hub_id=h.id and hl.is_active=1
            left join hub_level_type hlt on hlt.id=hl.hub_level_type_id
            where created_by=${obj.userId} and pkh.is_deleted=0 and
            pk.status='ACTIVE' group by h.id
            order by h.name limit ${(parseInt(obj.page) - 1) * 20}, 20`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public getSlotInfo = async (userId: string) => {
        try {
            const query = `select vacant_slots,total_slots from hub_slot_count where user_id=${userId};`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public searchHubs = async (obj) => {
        try {
            const query = `select h.id as hub_id,h.pin_code,h.name as hub_name,count(uh.id) as buyers_count,
            IFNULL(hlt.type,'new') as hub_level_type,
			IF(hlt.type is not null,CONCAT('${this.aws}','/icons/',hlt.img_url),CONCAT('${this.aws}','/icons/New.png')) as hub_level_image,
            IFNULL(hp.trade_off_value,0) as price from hub h
            left join user_hub uh ON uh.hub_id=h.id and uh.type in ('FOODY','BOTH') and uh.status
            not in ('BLOCK','PRIVATE_KITCHEN')
            left join hub_level hl on hl.hub_id=h.id and hl.is_active=1
            left join hub_level_type hlt on hlt.id=hl.hub_level_type_id
            left join hub_price hp on hp.hub_level_type_id=hlt.id
            where h.pin_code like "%${obj.pincode}%" and h.type not in ('private_kitchen','office')
            and h.is_deleted=0 and h.id not in (select hub_id from user_hub where
                user_id=${obj.userId} and status not in ('BLOCK','PRIVATE_KITCHEN') and type in ('both','buddy'))
            group by h.id limit 20 offset ${((obj.page ? obj.page : 1) - 1) * 20}`;
            // tslint:disable-next-line: no-console
            console.log(query);
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public searchHubsCount = async (obj) => {
        try {
            const query = `select count(DISTINCT(h.id)) as total_hubs from hub h
            left join user_hub uh ON uh.hub_id=h.id and uh.type in ('FOODY','BOTH') and uh.status
            not in ('BLOCK','PRIVATE_KITCHEN')
            where h.pin_code like "%${obj.pincode}%" and h.type not in ('private_kitchen','office')
            and h.is_deleted=0 and h.id not in (select hub_id from user_hub where
                user_id=${obj.userId} and status not in ('BLOCK','PRIVATE_KITCHEN') and type in ('both','buddy'))`;
            // tslint:disable-next-line: no-console
            console.log(query);
            const result = await this.sequelizeCon.query(query);
            return result[0][0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public addSlot = async (userId: string) => {
        try {
            const query = `INSERT INTO foody_buddy.hub_slot
            (user_id, unlocked_type, unlocked_at, created_at, updated_at)
            VALUES(${userId}, 'CREDIT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public getHubPrice = async (hub_id: string) => {
        try {
            const sql = `select IFNULL((select hp.trade_off_value as price
                from hub_level as hl
                inner join hub_level_type as hlt on hlt.id=hl.hub_level_type_id
                inner join hub_price as hp on hp.hub_level_type_id=hlt.id and hp.is_active=1
                where hl.hub_id=${hub_id} and hl.is_active=1 limit 1),0) as price`;
            const result = await this.sequelizeCon.query(sql);
            return result[0][0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }
    public deleteHub = async (obj) => {
        try {
            console.log(obj.params.userHubId);
            const query = `update secondary_hub_transaction sht,user_hub uh
            set uh.status="BLOCK", sht.is_occupied=0, sht.vacated_at=now()
            where uh.id=sht.user_hub_id and uh.id=${obj.params.userHubId}`;
            console.log(query);
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public addBuddyWallet = async (data: any) => {
        try {
            const sql = `INSERT INTO foody_buddy.buddy_wallet
            (user_id, transaction_type, amount, created_at, updated_at, origin, origin_id)
            VALUES(${data.user_id}, 'DEBIT', ${data.amount}, NOW(), NOW(), '${data.origin}', ${data.id})
            `;
            const result = await sequelize.query(sql);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public getSlotStatus = async (userId: string) => {
        try {
            const query = `select (select count(*) from secondary_hub_transaction sht inner join
            user_hub uh on uh.id=sht.user_hub_id where uh.user_id=${userId} and uh.status!='BLOCK'
            and sht.is_occupied=1) as
            occupied_slots,(select count(*) from hub_slot where user_id=${userId}) as total_slots;`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    // public getSlotStatus = async (userId: string) => {
    //     try {
    //         const query = `select (select count(*) from secondary_hub_transaction sht inner join user_hub uh on uh.id=sht.user_hub_id where uh.user_id=${userId} and sht.is_occupied=1) as total_slots,(select count(*) from hub_slot where user_id=${userId}) as occupied_slots`;
    //         const result = await this.sequelizeCon.query(query);
    //         return result[0];
    //     } catch (error) {
    //         // tslint:disable-next-line: no-console
    //         console.log(error.message);
    //         throw new ErrorFactory(error);
    //     }
    // }

    public isHubAddedByUser = async (obj) => {
        try {
            const query = `select * from user_hub uh
            inner join secondary_hub_transaction sht on sht.user_hub_id=uh.id
            inner join users u on u.id=uh.user_id
            where uh.id=${obj.params.userHubId} and uh.status!="BLOCK" and sht.is_occupied=1 and u.id=${obj.userId}`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public updateSlotCount = async (obj) => {
        try {
            const query = `INSERT INTO hub_slot_count (user_id, total_slots, vacant_slots)
            VALUES(${obj.userId}, ${obj.total_slots}, ${obj.total_slots - obj.occupied_slots})
            ON DUPLICATE KEY UPDATE total_slots=${obj.total_slots},
            vacant_slots=${obj.total_slots - obj.occupied_slots},
            is_available=${obj.total_slots == obj.occupied_slots ? 0 : 1};`;
            const result = await this.sequelizeCon.query(query);
            console.log(result);
            return result[0] ? { key: result[0] } : {};
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public getSlotPrice = async () => {
        try {
            const sql = `select price from slot_price where is_deleted=0`;
            const result = await sequelize.query(sql);
            return result[0][0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    // tslint:disable-next-line: variable-name
    public getBuddyCredit = async (user_id: string) => {
        try {
            const sql = `select IFNULL(sum(case WHEN transaction_type = 'CREDIT' then amount WHEN
            transaction_type = 'DEBIT'
            and origin != 'buddy_account_transactions' then -(amount) else 0 end),0)
            as buddy_credits from buddy_wallet where user_id=${user_id}`;
            const result = await sequelize.query(sql);
            return result[0][0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public checkUserSlotAvailability = async (user_id: string) => {
        try {
            const sql = `select * from hub_slot_count where user_id=${user_id} and is_available=1`;
            const result = await sequelize.query(sql);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public checkSecondaryHub = async (obj: any) => {
        try {
            console.log(obj);
            const sql = `SELECT * from user_hub
            where user_id=${obj.user_id} and hub_id=${obj.hub_id} and status not in ('BLOCK','PRIVATE_KITCHEN')`;
            const result = await sequelize.query(sql);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public addSecondaryHub = async (obj: any) => {
        try {
            const sql = `INSERT INTO foody_buddy.user_hub
            (user_id, hub_id, type, status, created_at, updated_at, first_time_buddy)
            VALUES(${obj.user_id}, ${obj.hub_id}, 'BUDDY', 'VERIFIED', NOW(), NOW(), 0);`;
            const result = await sequelize.query(sql);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public softDeleteManageApartmentRequestRecords = async (obj: any) => {
        try {
            const sql = `update manage_apartment_request set is_deleted=1 where buddy_id=${obj.userId}
            and hub_id=${obj.hub_id}`;
            const result = await sequelize.query(sql);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public addManageApartmentRequest = async (obj: any) => {
        try {
            const sql = `INSERT INTO foody_buddy.manage_apartment_request
            (hub_id, buddy_id, is_request_accepted, delivery_type, address_id, delivery_charge,
                is_deleted, created_at, updated_at, delivery_charge_id)
            VALUES(${obj.hub_id}, ${obj.userId},0,'home_delivery', '', 0,0,NOW(),NOW(),0)`;
            const result = await sequelize.query(sql);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public addSecondaryHubTransaction = async (user_hub_id: string) => {
        try {
            const sql = `INSERT INTO foody_buddy.secondary_hub_transaction
            (user_hub_id, occupied_at, vacated_at, is_occupied, created_at, updated_at)
            VALUES(${user_hub_id}, CURRENT_TIMESTAMP, '', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
            `;
            const result = await sequelize.query(sql);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public filterSearchHubs = async (data: any) => {
        try {
            const sql = `select h.id as hub_id,h.pin_code,h.name as hub_name,count(uh.id) as buyers_count,
            IFNULL(hlt.type,'new') as hub_level_type,
			IF(hlt.type is not null,CONCAT('${this.aws}','/icons/',hlt.img_url),CONCAT('${this.aws}','/icons/New.png')) as hub_level_image,
            IFNULL(hp.trade_off_value,0) as price from hub h
            left join user_hub uh ON uh.hub_id=h.id and uh.type in ('FOODY','BOTH') and uh.status
            not in ('BLOCK','PRIVATE_KITCHEN')
            left join hub_level hl on hl.hub_id=h.id
            left join hub_level_type hlt on hlt.id=hl.hub_level_type_id
            left join hub_price hp on hp.hub_level_type_id=hlt.id
            where h.pin_code like "%${data.pincode}%" and h.name like '%${data.hub_name}%'
            and h.type not in ('private_kitchen','office') and h.is_deleted=0
            and h.id not in (select hub_id from user_hub where
            user_id=${data.userId} and status not in ('BLOCK','PRIVATE_KITCHEN') and type in ('both','buddy'))
            group by h.id limit 20 offset ${((data.page ? data.page : 1) - 1) * 20}`;
            const result = await sequelize.query(sql);
            console.log(result[0]);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }

    public getUserRecentlyAddedHubs = async (obj: any) => {
        try {
            // tslint:disable-next-line: radix
            const query = `select h.id as hub_id,uh.id as user_hub_id,h.name as hub_name,
            IFNULL(hlt.type,'new') as hub_level_type,
            IF(hlt.type is not null,CONCAT('${this.aws}','/icons/',hlt.img_url),CONCAT('${this.aws}','/icons/New.png')) as hub_level_image,
             (select count(*) from
            user_hub where hub_id=h.id and type in ('FOODY','BOTH') and status not in
            ('BLOCK','PRIVATE_KITCHEN')) as buyers_count from user_hub as uh inner join hub as h on
            uh.hub_id=h.id and h.is_deleted=0 inner join secondary_hub_transaction sht on
            sht.user_hub_id=uh.id and sht.is_occupied=1 left join hub_level hl on hl.hub_id=h.id
            and hl.is_active=1 left join
            hub_level_type hlt on hlt.id=hl.hub_level_type_id where uh.type='BUDDY' and
            uh.status='VERIFIED' and h.type not in ('private_kitchen','office')
            and uh.user_id=${obj.userId} group by h.id order by sht.id desc limit 0, 10`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error.message);
            throw new ErrorFactory(error);
        }
    }
}

export const hubLevelModelIns = new HubLevelModel();
