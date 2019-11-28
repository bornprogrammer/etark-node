import { ISmsEntity } from './ISmsEntity';
import { SmsService } from './SmsService';
import { SmsVendorEnum } from './SmsVendorEnum';

class TextLocalService extends SmsService {

    constructor() {
        super();
        this.vendorName = SmsVendorEnum.TEXT_LOCAL;
    }

    public buildSMSPayload(iSmsEntityParams: ISmsEntity) {
        const smsConf = this.getSMSConfigurationByVendor();
        console.log(iSmsEntityParams);
        const sMSPayload = {
            apikey: smsConf.apikey,
            sender: smsConf.sender,
            numbers: iSmsEntityParams.mobile_number,
            message: iSmsEntityParams.message,
        };
        return sMSPayload;
    }
}

export const textLocalServiceIns = new TextLocalService();
