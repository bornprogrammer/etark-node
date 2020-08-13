import BaseRepository from "@app/repositories/BaseRepository";
import { UserPaymentDetails } from "@app/models/UserPaymentDetails";


export class UserPaymentDetailsRepository extends BaseRepository {

    public create = async (params: UserPaymentDetails) => {
        let result = await UserPaymentDetails.create({
            user_payment_id: params.id,
            gateway_response: params.gateway_response
        });
        return result;
    }
}

export const userPaymentDetailsRepositoryIns = new UserPaymentDetailsRepository();