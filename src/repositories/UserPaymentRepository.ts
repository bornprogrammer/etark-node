import BaseRepository from "@app/services/BaseRepository";
import { UserPayment, UserPaymentAttributes } from "@app/models/UserPayment";

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
}

export const userPaymentRepositoryIns = new UserPaymentRepository();