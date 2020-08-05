import BaseService from "@app/services/BaseService";
import MethodCoordinator from "@app/coordinators/method-cordinators/MethodCordinator";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { userRepositoryIns } from "./UserRepository";



class UserService extends BaseService {

    /**
     *
     */
    constructor() {
        super();
    }

    public addAddress = async (meth: MethodParamEntity) => {
        return await this.getMethodCoordinator().setMethod({ callableFunction: userRepositoryIns.addAddress, callableFunctionParams: meth.topMethodParam }).coordinate();
    }


}

export const userServiceIns = new UserService();