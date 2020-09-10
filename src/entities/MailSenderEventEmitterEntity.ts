import { MailTypeEnum } from "@app/enums/MailTypeEnum";




export interface MailSenderEventEmitterEntity {
    mailType: MailTypeEnum;
    mailData: any;
}