
import paytmchecksum from 'paytmchecksum';
import { PaytmChecksumEntity } from '@app/entities/PaytmChecksumEntity';
import { httpPostServiceIns } from '@app/http-services/HttpPostService';
import config from 'config';
import { AppConstants } from '@app/constants/AppConstants';
import { PaytmRefundParamsEntity } from '@app/entities/PaytmRefundParamsEntity';

class PaytmService {

    private paytmchecksum: any;
    private paytmParamsBody: any
    private refundParamsBody: any
    private mid: string;
    private urlProd: string;// = "https://securegw.paytm.in/";
    private urlStag: string;// = "https://securegw-stage.paytm.in/";
    private merchantKey: string;// = "t%6_v!wV#lymlZpr";
    /**
     *
     */
    constructor() {
        this.paytmchecksum = paytmchecksum;
        this.urlProd = AppConstants.PAYTM_URL;
        this.urlStag = AppConstants.PAYTM_STAGE_URL;
        this.mid = config.get("paytm.merchant_id");
        this.merchantKey = config.get("paytm.merchant_key");
        this.paytmParamsBody = {
            "requestType": "Payment",
            // "mid": "weoglH66146360524361",
            "mid": this.mid,
            "websiteName": "WEBSTAGING",
            "orderId": "",
            "callbackUrl": this.getCallbackURL(),
            "txnAmount": {
                "value": "",
                "currency": "INR",
            },
            "userInfo": {
                "custId": "",
            },
        }
        this.refundParamsBody = {
            "mid": this.mid,
            "txnType": "REFUND",
            "orderId": "",
            "txnId": "",
            "refId": "",
            "refundAmount": "",
        }
    }

    private getCallbackURL = () => {
        let url = AppConstants.SERVER_BASE_URL + ":" + process.env.PORT + "/api/user-plan/paytm-callback";
        return url;
    }

    public generatePaytmTxnToken = async (paytmChecksumEntity: PaytmChecksumEntity) => {
        this.setParams(paytmChecksumEntity);
        let checkSum = await this.paytmchecksum.generateSignature(JSON.stringify(this.paytmParamsBody), this.merchantKey);
        let paytmTxnToken = await this.callPaymtm(checkSum);
        return paytmTxnToken;
    }

    public generatePaytmTxnTokenForRefund = async (params: PaytmRefundParamsEntity) => {
        // this.setParams(paytmChecksumEntity);
        let checkSum = await this.paytmchecksum.generateSignature(JSON.stringify(this.paytmParamsBody), this.merchantKey);
        let paytmTxnToken = await this.callPaymtm(checkSum);
        return paytmTxnToken;
    }

    public refund = async (params: PaytmRefundParamsEntity) => {
        try {
            let body = await this.getRefundBody(params);
            // let paytmParams = { head: { "signature": checkSum }, body: body };
            let url = this.urlStag + "/refund/apply";
            let response = await httpPostServiceIns(url).setPayload({ body }).call();
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    private getRefundBody = async (params: PaytmRefundParamsEntity) => {
        let refundBody = Object.assign({}, this.getRefundBody);
        refundBody['orderId'] = params.orderId;
        refundBody['txnId'] = params.txnId;
        refundBody['refId'] = params.refundId;
        return refundBody;
    }

    public isPaytmCheckSumValid = (paytmResponse: any): boolean => {
        let paytmCheckSum = paytmResponse.CHECKSUMHASH;
        console.log("paytmCheckSum", paytmCheckSum);
        delete paytmResponse.CHECKSUMHASH;
        let isPaytmCheckSumValid = this.paytmchecksum.verifySignature(paytmResponse, this.merchantKey, paytmCheckSum);
        console.log("isPaytmCheckSumValid", isPaytmCheckSumValid);
        return isPaytmCheckSumValid;
    }

    private callPaymtm = async (checkSum: string) => {
        try {
            let paytmParams = { head: { "signature": checkSum }, body: this.paytmParamsBody };
            let url = this.urlStag + "theia/api/v1/initiateTransaction?mid=" + this.mid + "&orderId=" + this.paytmParamsBody.orderId;
            let response = await httpPostServiceIns(url).setPayload(paytmParams).call();
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    private setParams = (paytmChecksumEntity: PaytmChecksumEntity) => {
        this.paytmParamsBody.txnAmount.value = paytmChecksumEntity.amount;
        this.paytmParamsBody.userInfo.custId = paytmChecksumEntity.userId;
        this.paytmParamsBody.orderId = paytmChecksumEntity.orderId;
    }
}

export const paytmServiceIns = new PaytmService();