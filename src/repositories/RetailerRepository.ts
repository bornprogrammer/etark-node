import MethodParamEntity from "@app/entities/MethodParamEntity";
import { Retailer, RetailerAttribute } from "@app/models/Retailer";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { QueryTypes } from "sequelize";
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

    public getRetailerList = async (params: any) => {
        let query = `select retailers.retailer_name,retailers.phone_number,retailers.address,retailers.zip_code,cities.name
        from retailers inner join retailer_makers on retailers.id = retailer_makers.retailer_id
        inner join cities on retailers.city_id = cities.id
        where retailers.status='active' and retailer_makers.status='active'`;
        if (params.city_id) {
            query += " and retailers.city_id=" + params.city_id;
        }
        if (params.maker_id) {
            query += " and retailer_makers.maker_id=" + params.maker_id;
        }
        let result = await sequelizeConnection.connection.query(query, { type: QueryTypes.SELECT });
        return result;
    }




}
export const retailerRepositoryIns = new RetailerRepository();