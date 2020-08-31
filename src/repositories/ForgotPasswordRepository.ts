import BaseRepository from "./BaseRepository";
import { ForgotPasswordAttributes, ForgotPassword } from "@app/models/ForgotPassword";

export class ForgotPasswordRepository extends BaseRepository {

    public create = async (params: ForgotPasswordAttributes) => {
        let result = await ForgotPassword.create({
            email: params.email
        })
        return result;
    }

    public isForgotPasswordRequested = async (params: ForgotPasswordAttributes) => {
        let result = await ForgotPassword.findOne({
            where: {
                email: params.email,
                status: "active"
            }
        })
        return result;
    }

    public markForgotPasswordRequestDone = async (email: string) => {
        let result = await ForgotPassword.update({
            status: 'done'
        }, {
            where: {
                email: email,
                status: 'active'
            }
        })
        return result;
    }
}

export const forgotPasswordRepositoryIns = new ForgotPasswordRepository();