import MethodParamEntity from "@app/entities/MethodParamEntity";
import { Retailer, RetailerAttribute } from "@app/models/Retailer";
import BaseRepository from "./BaseRepository";


export class RetailerRepository extends BaseRepository {

    public create(params: RetailerAttribute) {

    }

    public retailerLogin = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await Retailer.findOne({
            where: {
                phone_number: params.phone_number,
                password: params.password,
                status: 'active'
            }
        })
        return result;
    }




}
export const retailerRepositoryIns = new RetailerRepository();