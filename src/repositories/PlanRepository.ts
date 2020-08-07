import BaseRepository from "@app/services/BaseRepository";
import { GetPlanComponentDetailsParamsEntity } from "@app/repo-method-param-entities/GetPlanComponentDetailsParamsEntity";
import { Plan } from "@app/models/Plan";
import { PlanComponent } from "@app/models/PlanComponents";

export class PlanRepository extends BaseRepository {

    /**
     *
     */
    constructor() {
        super();
    }

    public getPlanComponentDetails = async (params: GetPlanComponentDetailsParamsEntity) => {
        // let params = methodParamEntity.topMethodParam;
        let result = await Plan.findOne({
            where: {
                id: params.planId,
            },
            include: {
                model: PlanComponent,
                where: {
                    status: params.planComponentStatus
                },
                required: true
            }
        });
        return result;
    }
    public create = async (params: any) => {
        throw new Error("Method not implemented.");
    }

}

export const planRepositoryIns = new PlanRepository();