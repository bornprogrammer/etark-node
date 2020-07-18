import db from '@app/models';

export class OldUserAccountsRepository {

    public findOneByAttributes = (attrs: any) => {
        return db.UserAccountOld.findOne({
            where: attrs,
        });
    }

    public create = (attrs: any) => {
        return db.UserAccountOld.create(attrs);
    }

}
