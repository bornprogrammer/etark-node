
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { MakerDetails } from "@app/models/MakerDetails";
import { Maker } from "@app/models/Maker";
import { Merchant } from "@app/models/Merchant";
import { Op } from "sequelize";
import { Plan } from "@app/models/Plan";
import { City } from "@app/models/City";
import BaseRepository from "@app/repositories/BaseRepository";

export class MasterRepository extends BaseRepository {
    /**
     *
     */
    constructor() {
        super();
    }

    public create(params: any) {
        throw new Error("Method not implemented.");
    }

    public getMakerListByCategoryId = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await Maker.findAll({
            include: {
                model: MakerDetails,
                where: {
                    category_id: params.id
                },
                required: true
            },
        })
        return result;
    }

    public getMerchantList = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await Merchant.findAll({
            where: {
                [Op.or]: [
                    {
                        merchant_type: params.type
                    },
                    {
                        merchant_type: "both"
                    }
                ]
            }
        })
        return result;
    }

    public getPlans = async (methodParamEntity: MethodParamEntity) => {
        let result = await Plan.findAll();
        return result;
    }

    public getCities = async () => {
        let result = await City.findAll({
            where: {
                status: 'active'
            }
        });
        return result;
    }
}

export const masterRepositoryIns = new MasterRepository();