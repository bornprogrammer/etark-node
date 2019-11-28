import db from '@app/models';

export class UserAccountsRepository {

    public findOne = (attrs: any) => {
        return db.UserAccount.findOne({
            where: attrs,
        });
    }

    public create = (attrs: any) => {
        return db.UserAccount.create(attrs);
    }

    public maxId = () => {
        return db.UserAccount.max('id');
    }

    public getUserIdBetweenAccIds = (minId, maxId) => {
        return db.UserAccount.findAll({
            where: {
                id: {
                    [db.Sequelize.Op.between]: [minId, maxId],
                },
            },
            attributes: [
                'userId',
            ],
        });
    }

    public findAllWithPendingAmountFromFb = (idGreaterThan: number, limit: number) => {
        return db.sequelize.query(
            `SELECT
                ua.id, ua.user_id as userId,
                (ua.online_orders_amount - ua.received_online_orders_amount) AS credit,
                ((ua.incurred_pk_plan_charge + incurred_pk_gateway_charge + incurred_service_charge)
                - paid_overall_charge) AS debit,
                (ua.online_orders_amount - ua.received_online_orders_amount)
                - (
                    (ua.incurred_pk_plan_charge + incurred_pk_gateway_charge + incurred_service_charge)
                    - paid_overall_charge
                ) AS amount,
                uba.id AS userBankAccountId, uba.account_number AS accountNumber, uba.ifsc,
                uba.account_holder_name AS accountHolderName, uba.validation_status AS validationStatus,
                upa.id as userPaytmAccountId, upa.phone AS paytmPhoneNumber
            from v2_user_accounts AS ua
            LEFT JOIN user_bank_accounts AS uba ON uba.user_id = ua.user_id AND uba.deleted_at IS NULL
            LEFT JOIN user_paytm_accounts AS upa ON upa.user_id = ua.user_id AND upa.deleted_at IS NULL
            WHERE (ua.online_orders_amount - ua.received_online_orders_amount) - (
                    (ua.incurred_pk_plan_charge + incurred_pk_gateway_charge + incurred_service_charge)
                    - paid_overall_charge
                ) > 0
            AND ua.id > ? ORDER BY ua.id ASC LIMIT ?`,
            { replacements: [idGreaterThan, limit], type: db.sequelize.QueryTypes.SELECT },
        );
    }

}
