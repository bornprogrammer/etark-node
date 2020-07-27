import BaseRepository from "@app/repositories/BaseRepository";
import MethodParamEntity from "@app/entities/MethodParamEntity";



export class MakerRepository extends BaseRepository {

    /**
     *
     */
    constructor() {
        super();
    }

    public getMakerListByCategoryId = async (methodParamEntity: MethodParamEntity) => {
        // let result = Makerde
    }
}