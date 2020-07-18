import { configJSONReaderHelperIns } from '@app/modules/helper/ConfigJSONReaderHelper';
import * as firebaseAdmin from 'firebase-admin';
import { IFcmPushNotficationPayloadEntity } from './IFcmPushNotficationPayloadEntity';

class FcmPushNotficationService {

    private fcmConfiguration: any;

    constructor() {
        this.fcmConfiguration = configJSONReaderHelperIns.read('fcm');
        firebaseAdmin.initializeApp({ credential: firebaseAdmin.credential.cert(this.fcmConfiguration) });
    }

    public send(deviceToken: string[], payload: IFcmPushNotficationPayloadEntity) {
        while (deviceToken.length >= 1000) {
            firebaseAdmin.messaging().sendToDevice(deviceToken.splice(0, 1000), payload);
        }
        if (deviceToken.length > 0) {
            firebaseAdmin.messaging().sendToDevice(deviceToken, payload);
        }
    }
}

export const fcmPushNotficationServiceIns = new FcmPushNotficationService();