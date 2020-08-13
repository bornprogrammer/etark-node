import BaseRepository from "@app/repositories/BaseRepository";
import { AddUserPlanComponentsParamsEntity } from "@app/repo-method-param-entities/AddUserPlanComponentsParamsEntity";
import { UserPlanComponent } from "@app/models/UserPlanComponent";
import { UpdateUserPlanComponentPriceParamEntity } from "@app/repo-method-param-entities/UpdateUserPlanComponentPriceParamEntity";

export class UserPlanComponentRepository extends BaseRepository {

    public create = async (params: AddUserPlanComponentsParamsEntity) => {
        for (const planComponentObj of params.planComponent) {
            await UserPlanComponent.create({
                user_plan_id: params.userPlanId,
                plan_components_id: planComponentObj.id,
                component_price: planComponentObj.component_price
            });
        }
        return true;
    }

    public update = async (params: UpdateUserPlanComponentPriceParamEntity) => {
        let update = UserPlanComponent.update({
            component_price: params.componentPrice
        }, {
            where: {
                id: params.userPlanComponentId
            }
        })
        return update;
    }


}

export const userPlanComponentRepositoryIns = new UserPlanComponentRepository();