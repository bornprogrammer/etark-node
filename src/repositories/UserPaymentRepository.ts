import BaseRepository from "@app/repositories/BaseRepository";
import { UserPayment, UserPaymentAttributes } from "@app/models/UserPayment";
import { UpdateUserPaymentStatusParamsEntity } from "@app/repo-method-param-entities/UpdateUserPaymentStatusParamsEntity";

class UserPaymentRepository extends BaseRepository {

    /**
     *
     */
    constructor() {
        super();
    }

    public create = async (userPayment: UserPaymentAttributes) => {
        let result = await UserPayment.create(userPayment);
        return result;
    }

    public update = async (userPayment: UserPayment) => {
        let result = await userPayment.save();
        return result;
    }

    public updateUserPaymentStatus = async (params: UpdateUserPaymentStatusParamsEntity) => {
        let result = await UserPayment.update({
            payment_status: params.paymentStatus
        }, {
            where: {
                id: params.orderId,
                payment_status: 'pending'
            }
        });
        return result;
    }
}

export const userPaymentRepositoryIns = new UserPaymentRepository();