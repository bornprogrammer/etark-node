import BaseRepository from "@app/services/BaseRepository";
import { UserPayment, UserPaymentAttributes } from "@app/models/UserPayment";
import { UpdateUserPlanComponentPriceParamEntity } from "@app/repo-method-param-entities/UpdateUserPlanComponentPriceParamEntity";
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
                // paytm_checksum: params.checksum,
                order_no: params.orderNo,
            }
        });
        return result;
    }
}

export const userPaymentRepositoryIns = new UserPaymentRepository();