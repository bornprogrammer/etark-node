import BaseService from "@app/services/BaseService";
import { AuthRepository, authRepositoryIns } from "./AuthRepository";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import BadHttpRequestError from "@app/errors/BadHttpRequestError";
import { forgotPasswordRepositoryIns } from "@app/repositories/ForgotPasswordRepository";
import UnAuthorized from "@app/errors/UnAuthorized";
import { EmailNotFoundError } from "@app/errors/EmailNotFoundError";

export class AuthRepositoryService extends BaseService {

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

    public forgotPassword = async (methodParamEntity: MethodParamEntity) => {
        const result = await this.getMethodCoordinator().setMethod({ callableFunction: this.isEmailValid, callableFunctionParams: methodParamEntity.topMethodParam }).setMethod({ callableFunction: this.addForgotPasswordRequest }).coordinate();
        return result;
    }

    public isEmailValid = async (params: MethodParamEntity) => {
        const topParams = params.topMethodParam;
        let result = await authRepositoryIns.isEmailValid(topParams.email);
        if (!result) {
            throw new EmailNotFoundError();
        }
        return result;
    }

    public addForgotPasswordRequest = async (params: MethodParamEntity) => {
        let topParams = params.topMethodParam;
        let result = await forgotPasswordRepositoryIns.create({ email: topParams.email });
        return result;
    }

    public resetPassword = async (params: MethodParamEntity) => {
        let topParams = params.topMethodParam;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.isForgotPasswordRequested, callableFunctionParams: topParams }).setMethod({ callableFunction: this.resetPasswordByEmail }).setMethod({ callableFunction: this.markForgotPasswordRequestDone }).coordinate();
        return result;
    }

    public isForgotPasswordRequested = async (params: MethodParamEntity) => {
        let topParams = params.topMethodParam;
        let result = await forgotPasswordRepositoryIns.isForgotPasswordRequested({ email: topParams.email });
        if (!result) {
            throw new UnAuthorized("forgot password has not been requested by this email " + topParams.email);
        }
        return result;
    }

    public resetPasswordByEmail = async (params: MethodParamEntity) => {
        let topParams = params.topMethodParam;
        let result = await authRepositoryIns.resetPasswordByEmail({ email: topParams.email, password: topParams.password });
        return result;
    }

    public markForgotPasswordRequestDone = async (params: MethodParamEntity) => {
        let topParams = params.topMethodParam;
        let result = await forgotPasswordRepositoryIns.markForgotPasswordRequestDone(topParams.email);
        return result;
    }
}

export const authRepositoryServiceIns = new AuthRepositoryService(authRepositoryIns);
