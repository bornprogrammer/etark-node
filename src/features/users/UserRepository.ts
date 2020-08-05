import BaseRepository from "@app/services/BaseRepository";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { UserAddress } from "@app/models/UserAddress";

export class UserRepository extends BaseRepository {
    /**
     *
     */
    constructor() {
        super();
    }

    public addAddress = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        return await UserAddress.create({
            address: params.address,
            zip_code: params.zip_code,
            user_id: params.user_id
        })
    }
}

export const userRepositoryIns = new UserRepository();