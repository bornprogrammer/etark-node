import BaseRepository from "@app/services/BaseRepository";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { User } from "@app/models/User";
import { Op } from "sequelize";
import { UserAlreadyExists } from "@app/errors/UserAlreadyExists";
import { UserStatusEnum } from "@app/enums/UserStatusEnum";
import { UserSuspended } from "@app/errors/UserSuspended";
import UnAuthorized from "@app/errors/UnAuthorized";

export class AuthRepository extends BaseRepository {
    /**
     *
     */
    constructor() {
        super();
    }

    public loginUser = async (methodParamEntity: MethodParamEntity) => {
        const params = methodParamEntity.topMethodParam;
        const result = await User.findOne({
            where: {
                mobile_number: params.mobile_number,
                password: params.password
            }
        });
        if (!result) {
            throw new UnAuthorized();
        } else {
            if (result.status === UserStatusEnum.SUSPENDED) {
                throw new UserSuspended();
            }
        }
        return result;
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