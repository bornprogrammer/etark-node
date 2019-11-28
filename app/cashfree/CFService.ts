import { httpPostServiceIns } from '@app/http/HttpPostService';
import { configJSONReaderHelperIns } from '@app/modules/helper/ConfigJSONReaderHelper';
import { ICashFreeEntity } from '@app/modules/order/ICashFreeEntity';

class CFService {

    public async generateCFToken(payload: ICashFreeEntity) {
        const cfConfig = this.getCFConfig();
        const cfTokenUrl = cfConfig.cf_domain + cfConfig.cf_token_url;
        const res = await this.callCashFreeAPI(cfTokenUrl, payload, this.getCFHeaders(cfConfig));
        let token = '';
        if (res.status === 'OK') {
            token = res.cftoken;
        }
        return token;
    }

    public async generateCFPaymentLink(payload: ICashFreeEntity) {
        const cfConfig = this.getCFConfig();
        payload.appId = cfConfig.app_id;
        payload.secretKey = cfConfig.secret_key;
        const cfPaymentLinkUrl = cfConfig.cf_domain + cfConfig.cf_payment_link_url;
        payload.returnUrl = cfConfig.cf_payment_return_url;
        const res = await httpPostServiceIns(cfPaymentLinkUrl).setFormUrlEncodedPayload(payload).call();
        let paymentLink = '';
        if (res.status === 'OK') {
            paymentLink = res.paymentLink;
        }
        return paymentLink;
    }

    /**
     * will return the cashfree configuration
     */
    private getCFConfig() {
        const cashFreeConf = configJSONReaderHelperIns.read('cashfree');
        return cashFreeConf;
    }

    private async callCashFreeAPI(cashFreeUrl: string, payload: ICashFreeEntity, headers?: object) {
        const resp = await httpPostServiceIns(cashFreeUrl).setPayload(payload).setHeadersAsObj(headers).call();
        return resp;
    }

    private getCFHeaders(cashFreeConf: any) {
        const cashFreeHeaders = { 'x-client-id': cashFreeConf.app_id, 'x-client-secret': cashFreeConf.secret_key };
        return cashFreeHeaders;
    }
}

export const cfServiceIns = new CFService();
