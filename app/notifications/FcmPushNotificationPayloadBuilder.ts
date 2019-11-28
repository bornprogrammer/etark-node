import { PnsEventsName } from '@app/enums/PnsEventsName';
// tslint:disable-next-line: ordered-imports
import { configJSONReaderHelperIns } from '@app/modules/helper/ConfigJSONReaderHelper';
import { stringHelperIns } from '@app/modules/helper/StringHelper';
import { IFcmPushNotficationPayloadEntity } from './IFcmPushNotficationPayloadEntity';
import { inputHelperIns } from '@app/modules/helper/InputHelper';

export class FcmPushNotificationPayloadBuilder {

    private payload: any;
    private pnsName: PnsEventsName; // will hold the pns name
    private bodyTemplateVal: any;
    private message: string;
    private title: string;
    constructor() {
        this.payload = { notification: {}, data: {} };
    }

    public setPNSName(pnsName: PnsEventsName) {
        this.pnsName = pnsName;
        return this;
    }

    public setMessage(message: string) {
        this.message = message;
        return this;
    }

    public setTitle(title: string) {
        this.title = title;
        return this;
    }

    public setPayloadVal(key: string, value: string) {
        this.payload.data[key] = value;
        return this;
    }

    public setMultiplePayloadVal(payloadObj: any) {
        if (inputHelperIns.isObjectValidNNotEmpty(payloadObj)) {
            // tslint:disable-next-line: forin
            for (const payloadKey in payloadObj) {
                this.payload[payloadKey] = payloadObj[payloadKey];
            }
        }
        return this;
    }

    public setPayloadValWithCastValAsStr(key: string, value: string) {
        this.payload.data[key] = value.toString();
        return this;
    }

    public setBodyTemplateValue(bodyTemplateVal: any) {
        this.bodyTemplateVal = bodyTemplateVal;
        return this;
    }

    public build(): IFcmPushNotficationPayloadEntity {
        const pnsEvents = configJSONReaderHelperIns.read('pns_events');
        const pnsConf = pnsEvents[this.pnsName];
        return this.setBody(pnsConf.message).buildTitle(pnsConf.title).setPnsType(pnsConf.pns_type).payload;
    }

    private setBody(pnsConfMessage: string) {
        const bodyMessage = this.buildBodyMessageWithTemplatedValue(this.message || pnsConfMessage);
        this.payload.notification.body = bodyMessage;
        this.payload.data.body = bodyMessage;
        return this;
    }

    /**
     * message format could be <user_name> has upvoted ur answer
     */
    private buildBodyMessageWithTemplatedValue = (message: string) => {
        let bodyMessageWithTemplatedValue = message;
        if (this.bodyTemplateVal) {
            bodyMessageWithTemplatedValue = stringHelperIns.replaceStringPlaceHolderWithObjVal(message, this.bodyTemplateVal);
        }
        return bodyMessageWithTemplatedValue;
    }

    private buildTitle(title: string) {
        this.payload.notification.title = this.title || title;
        this.payload.data.title = this.title || title;
        return this;
    }

    private setPnsType(pnsType: string) {
        this.payload.data.pns_type = pnsType;
        return this;
    }
}

export const fcmPushNotificationPayloadBuilderIns = () => {
    return new FcmPushNotificationPayloadBuilder();
};
