import BaseRepository from "@app/services/BaseRepository";

import MethodParamEntity from "@app/entities/MethodParamEntity";

import { User } from "@app/models/User";
import { Op } from "sequelize";
import { UserAlreadyExists } from "@app/errors/UserAlreadyExists";

export class AuthRepository extends BaseRepository {
    /**
     *
     */
    constructor() {
        super();
    }

    public isUserActive = async (methodParamEntity: MethodParamEntity) => {
        let isUserActive = await User.count({

        })
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
                        mobile_number: params.mobile_number,
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
        let user = await User.create(params);
        return user;
    }
}

export const authRepositoryIns = new AuthRepository(); 