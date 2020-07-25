import BaseService from "@app/services/BaseService";
import { AuthRepository, authRepositoryIns } from "./AuthRepository";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import BadHttpRequestError from "@app/errors/BadHttpRequestError";

export class AuthService extends BaseService {

    protected authRepository: AuthRepository;

    /**
     *
     */
    constructor(authRepository: AuthRepository) {
        super();
        this.authRepository = authRepository;
    }

    public login = async (methodParamEntity: MethodParamEntity) => {
        throw new BadHttpRequestError();
    }

    public createUser = async (methodParamEntity: MethodParamEntity) => {
        const result = await this.getMethodCoordinator().setMethod({ callableFunction: this.authRepository.doesUserNotExist, callableFunctionParams: methodParamEntity.topMethodParam }).setMethod({ callableFunction: this.authRepository.createUser }).coordinate();
        return result;
    }
}


export const authServiceIns = new AuthService(authRepositoryIns);
