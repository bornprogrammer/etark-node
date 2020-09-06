import BaseRepository from "./BaseRepository";
import { UserRefundAttributes, UserRefund } from "@app/models/UserRefund";



export class UserRefundRepository extends BaseRepository {

    public create = async (params: UserRefundAttributes) => {
        let result = await UserRefund.create({
            user_payment_id: params.user_payment_id,
            gateway_response: params.gateway_response
        })
        return result;
    }
}

export const userRefundRepositoryIns = new UserRefundRepository();