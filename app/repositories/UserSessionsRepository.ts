import db from '@app/models';

export class UserSessionsRepository {

    public findOneByToken = (token: string) => {
        return db.UserSession.findOne({
            where: {
                token,
            },
            attributes: ['userId'],
        });
    }

    public findTokenByUserId = (userId: number) => {
        return db.sequelize.query(`select token from user_sessions where id
            IN (select max(id) from user_sessions where user_id = ?)`,
            { replacements: [userId], type: db.sequelize.QueryTypes.SELECT },
        );
    }

}
