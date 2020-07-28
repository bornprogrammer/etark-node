import BaseRepository from "@app/repositories/BaseRepository";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { MakerDetails } from "@app/models/MakerDetails";
import { Maker } from "@app/models/Maker";

export class MakerRepository extends BaseRepository {
    /**
     *
     */
    constructor() {
        super();
    }

    public getMakerListByCategoryId = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await MakerDetails.findAll({
            where: {
                category_id: params.id
            },
            include: "Maker"
        })
        return result;
    }
}
export const makerRepositoryIns = new MakerRepository();