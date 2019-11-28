import { ISmsEntity } from './ISmsEntity';
import { textLocalServiceIns } from './TextLocalService';

class SmsFactory {

    constructor() {
    }

    public async send(iSmsEntityParams: ISmsEntity) {
        try {
            textLocalServiceIns.send(iSmsEntityParams);
        } catch (error) {
            console.log('here');
        }
    }

}

export const smsFactoryIns = new SmsFactory();
