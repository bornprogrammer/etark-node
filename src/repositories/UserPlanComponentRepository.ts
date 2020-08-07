import BaseRepository from "@app/services/BaseRepository";
import { AddUserPlanComponentsParamsEntity } from "@app/repo-method-param-entities/AddUserPlanComponentsParamsEntity";
import { UserPlanComponent } from "@app/models/UserPlanComponent";

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


}

export const userPlanComponentRepositoryIns = new UserPlanComponentRepository();