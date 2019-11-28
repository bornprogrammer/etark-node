import { httpPostServiceIns } from '@app/http/HttpPostService';
import { configJSONReaderHelperIns } from '@app/modules/helper/ConfigJSONReaderHelper';
import { ISmsEntity } from './ISmsEntity';

export abstract class SmsService {

    protected vendorName: string;
    protected smsConfiguration: object;

    /**
     * tenplate method pattern
     * @param mobileNumber
     * @param message
     */
    public async send(iSmsEntityParams: ISmsEntity) {
        try {
            if (this.isSMSEnabled()) {
                const vendorUrl = this.getSMSConfigurationByVendor().uri;
                const result = await httpPostServiceIns(vendorUrl).setFormUrlEncodedPayload(this.buildSMSPayload(iSmsEntityParams)).call();
                console.log(result);
            }
        } catch (error) {
            console.log('here');
        }
    }

    public abstract buildSMSPayload(iSmsEntityParams: ISmsEntity);

    protected getSMSConfiguration() {
        if (!this.smsConfiguration) {
            this.smsConfiguration = configJSONReaderHelperIns.read('sms');
        }
        return this.smsConfiguration;
    }

    protected getSMSConfigurationByVendor() {
        const smsConfiguration = this.getSMSConfiguration();
        let smsConfigurationByVendor = null;
        if (smsConfiguration[this.vendorName] !== null) {
            smsConfigurationByVendor = smsConfiguration[this.vendorName];
        }
        return smsConfigurationByVendor;
    }

    protected isSMSEnabled = () => {
        const smsConfiguration: any = this.getSMSConfiguration();
        return smsConfiguration.is_sms_allowed;
    }
}
