import BaseRepository from "@app/services/BaseRepository";

import MethodParamEntity from "@app/entities/MethodParamEntity";

import { User } from "@app/models/User";
import { Op } from "sequelize";
import { UserAlreadyExists } from "@app/errors/UserAlreadyExists";
import { UserStatusEnum } from "@app/enums/UserStatusEnum";

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

    /**
     * 
     * @param methodParamEntity 
     */
    public doesUserNotExist = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let count = await User.count({
            where: {
                [Op.or]: [
                    {
                        mobileNumber: params.mobileNumber,
                        email: params.email
                    }
                ]
            }
        });
        if (count > 0) {
            throw new UserAlreadyExists();
        }
        return true;
    }

    public createUser = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let data = await User.create(params);
        return params;
    }
}

export const authRepositoryIns = new AuthRepository(); 