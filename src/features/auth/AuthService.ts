
import BaseService from "@app/services/BaseService";
import { AuthRepository, authRepositoryIns } from "./AuthRepository";
import MethodParamEntity from "@app/coordinators/method-cordinators/MethodParamEntity";
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
}


export const authServiceIns = new AuthService(authRepositoryIns);
