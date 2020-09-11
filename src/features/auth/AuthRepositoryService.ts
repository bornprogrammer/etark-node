import BaseService from "@app/services/BaseService";
import { AuthRepository, authRepositoryIns } from "./AuthRepository";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { forgotPasswordRepositoryIns } from "@app/repositories/ForgotPasswordRepository";
import UnAuthorized from "@app/errors/UnAuthorized";
import { EmailNotFoundError } from "@app/errors/EmailNotFoundError";
import { mailSenderEventEmitterIns } from "@app/events/MailSenderEventEmitter";
import { EventEmitterIdentifierEnum } from "@app/enums/EventEmitterIdentifierEnum";
import { MailSenderEventEmitterEntity } from "@app/entities/MailSenderEventEmitterEntity";
import { MailTypeEnum } from "@app/enums/MailTypeEnum";
import { ForgotPasswordMailEntity } from "@app/entities/ForgotPasswordMailEntity";
import { StoreResultAs } from "@app/enums/StoreResultAs";
import config from "config";
import ArrayHelper from "@app/helpers/ArrayHelper";

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

    public adminLogin = async (methodParamEntity: MethodParamEntity) => {
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.validateAdminLoginCredential, callableFunctionParams: methodParamEntity.topMethodParam }).coordinate();
        return result;
    }

    public validateAdminLoginCredential = async (params: MethodParamEntity) => {
        let topParams = params.topMethodParam;
        let result = await this.mAuthRepository.adminLogin({ email: topParams.email, password: topParams.password });
        if (!ArrayHelper.isArrayValid(result)) {
            throw new UnAuthorized();
        }
        return result;
    }

    public createUser = async (methodParamEntity: MethodParamEntity) => {
        const result = await this.getMethodCoordinator().setMethod({ callableFunction: this.mAuthRepository.doesUserNotExist, callableFunctionParams: methodParamEntity.topMethodParam }).setMethod({ callableFunction: this.mAuthRepository.createUser }).coordinate();
        return result;
    }

    public forgotPassword = async (methodParamEntity: MethodParamEntity) => {
        const result = await this.getMethodCoordinator().setMethod({ callableFunction: this.isEmailValid, callableFunctionParams: methodParamEntity.topMethodParam, storeResultAs: StoreResultAs.FORGOT_PASSWORD }).setMethod({ callableFunction: this.addForgotPasswordRequest, resultToBeReturnedAsFinalResult: true }).setMethod({ callableFunction: this.sendForgotPasswordEmail }).coordinate();
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

    public sendForgotPasswordEmail = async (params: MethodParamEntity) => {
        let topParams = params.topMethodParam;
        let userDetails = params.methodReturnedValContainer[StoreResultAs.FORGOT_PASSWORD];
        let resetLink = config.get("client_base_url") + "reset_pwd?email=" + topParams.email;
        let forgotPasswordParams: ForgotPasswordMailEntity = { email: topParams.email, name: userDetails.name, reset_link: resetLink };
        let mailSenderParams: MailSenderEventEmitterEntity = { mailType: MailTypeEnum.MAIL_TYPE_FORGOT_PASSWORD, mailData: forgotPasswordParams };
        mailSenderEventEmitterIns.emit(EventEmitterIdentifierEnum.MAIL_SENDER_EVENTEMITTER, mailSenderParams);
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
