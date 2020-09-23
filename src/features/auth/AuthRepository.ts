import BaseRepository from "@app/repositories/BaseRepository";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { User } from "@app/models/User";
import { Op, QueryTypes } from "sequelize";
import { UserAlreadyExists } from "@app/errors/UserAlreadyExists";
import { UserStatusEnum } from "@app/enums/UserStatusEnum";
import { UserSuspended } from "@app/errors/UserSuspended";
import UnAuthorized from "@app/errors/UnAuthorized";
import { SrvRecord } from "dns";
import { ResetPasswordByEmailParamsEntity } from "@app/repo-method-param-entities/ResetPasswordByEmailParamsEntity";
import { sequelizeConnection } from "@app/SequelizeConnection";

export class AuthRepository extends BaseRepository {

    public create(params: any) {
        throw new Error("Method not implemented.");
    }
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

    public adminLogin = async (params: any) => {
        let query = `select name,email,password,status
        from admin where email=:email and password=:password and status='active'`;
        let result = await sequelizeConnection.connection.query(query, { type: QueryTypes.SELECT, replacements: { email: params.email, password: params.password } });
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
                    },
                    {
                        email: params.email
                    }
                ]
            }
        });
        // throw new UserAlreadyExists();
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

    public isEmailValid = async (email: string) => {
        let user = await User.findOne({
            where: {
                email: email,
                status: "active"
            }
        });
        return user;
    }

    public resetPasswordByEmail = async (params: ResetPasswordByEmailParamsEntity) => {
        let result = await User.update({
            password: params.password
        }, {
            where: {
                email: params.email,
                status: "active"
            }
        })
        return result;
    }
}

export const authRepositoryIns = new AuthRepository(); 