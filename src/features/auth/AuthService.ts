import BaseService from "@app/services/BaseService";
import { AuthRepository, authRepositoryIns } from "./AuthRepository";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import BadHttpRequestError from "@app/errors/BadHttpRequestError";

export class AuthService extends BaseService {

    protected mAuthRepository: AuthRepository;

    /**
     *
     */
    constructor(authRepository: AuthRepository) {
        super();
        this.mAuthRepository = authRepository;
    }

    public login = async (methodParamEntity: MethodParamEntity) => {
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.mAuthRepository.loginUser, callableFunctionParams: methodParamEntity.topMethodParam }).coordinate();
        return result;
    }

    public createUser = async (methodParamEntity: MethodParamEntity) => {
        const result = await this.getMethodCoordinator().setMethod({ callableFunction: this.mAuthRepository.doesUserNotExist, callableFunctionParams: methodParamEntity.topMethodParam }).setMethod({ callableFunction: this.mAuthRepository.createUser }).coordinate();
        return result;
    }
}


export const authServiceIns = new AuthService(authRepositoryIns);
