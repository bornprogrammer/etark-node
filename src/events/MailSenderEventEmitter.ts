import { BaseQueue } from "./BaseQueue";
import { MailSenderEventEmitterEntity } from "@app/entities/MailSenderEventEmitterEntity";
import { MailTypeEnum } from "@app/enums/MailTypeEnum";
import { ForgotPasswordMailEntity } from "@app/entities/ForgotPasswordMailEntity";
import { fileReaderServiceIns } from "@app/services/FileReaderService";
import { nodeMailerServiceIns } from "@app/services/NodeMailerService";
import { UtilsHelper } from "@app/helpers/UtilsHelper";
import config from "config";
import { EventEmitterIdentifierEnum } from "@app/enums/EventEmitterIdentifierEnum";


export class MailSenderEventEmitter extends BaseQueue {


    /**
     *
     */
    constructor() {
        super(EventEmitterIdentifierEnum.MAIL_SENDER_EVENTEMITTER);
    }

    public async handleJob(data?: MailSenderEventEmitterEntity) {

        if (data.mailType === MailTypeEnum.MAIL_TYPE_FORGOT_PASSWORD) {
            this.sendForgotPasswordEmail(data.mailData);
        }
    }

    public sendForgotPasswordEmail = async (data: ForgotPasswordMailEntity) => {
        fileReaderServiceIns.readEmailTemplate("forgotPassword.html", (error, htmlStr) => {
            data.base_url = UtilsHelper.getBaseURL();
            nodeMailerServiceIns.sendHtml(config.get("mail.from"), data.email, "Forgot Password", UtilsHelper.replaceAllStr(data, htmlStr));
        })
    }
}

export const mailSenderEventEmitterIns = new MailSenderEventEmitter();