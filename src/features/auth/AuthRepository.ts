import BaseRepository from "@app/services/BaseRepository";
import MethodParamEntity from "@app/coordinators/method-cordinators/MethodParamEntity";


export class AuthRepository extends BaseRepository {
    /**
     *
     */
    constructor() {
        super();
    }

    public isUserActive = async (methodParamEntity: MethodParamEntity) => {
        return methodParamEntity.topMethodParam;
    }
}

export const authRepositoryIns = new AuthRepository(); 