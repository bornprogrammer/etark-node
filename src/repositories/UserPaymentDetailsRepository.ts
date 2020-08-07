import BaseRepository from "@app/services/BaseRepository";
import { UserPaymentDetails } from "@app/models/UserPaymentDetails";


export class UserPaymentDetailsRepository extends BaseRepository {

    public create = async (params: UserPaymentDetails) => {
        let result = UserPaymentDetails.create({
            user_payment_id: params.id,
            gateway_response: params.gateway_response
        });
    }
}

export const userPaymentDetailsRepositoryIns = new UserPaymentDetailsRepository();