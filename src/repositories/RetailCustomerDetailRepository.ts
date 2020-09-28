import { RetailCustomerDetail, RetailCustomerDetailAttributes } from "@app/models/RetailCustomerDetail";
import BaseRepository from "./BaseRepository";



export class RetailCustomerDetailRepository extends BaseRepository {


    public create = async (params: RetailCustomerDetailAttributes) => {
        let result = await RetailCustomerDetail.create({
            customer_name: params.customer_name,
            email: params.email,
            contact: params.contact,
            bill_id: params.bill_id,
            maker_id: params.maker_id,
        })
        return result;
    }
}

export const retailCustomerDetailRepositoryIns = new RetailCustomerDetailRepository();