
import paytmchecksum from 'paytmchecksum';
import { PaytmChecksumEntity } from '@app/entities/PaytmChecksumEntity';
import { httpPostServiceIns } from '@app/http-services/HttpPostService';

class PaytmService {

    private paytmchecksum: any;
    private paytmParamsBody: any
    private urlProd: string = "securegw.paytm.in/";
    private urlStag: string = "https://securegw-stage.paytm.in/";
    private merchantKey: string = "t%6_v!wV#lymlZpr";
    /**
     *
     */
    constructor() {
        this.paytmchecksum = paytmchecksum;
        this.paytmParamsBody = {
            "requestType": "Payment",
            "mid": "weoglH66146360524361",
            "websiteName": "WEBSTAGING",
            "orderId": "",
            "callbackUrl": "http://13.235.67.24:5000/api/user-plan/paytm-callback",
            "txnAmount": {
                "value": "",
                "currency": "INR",
            },
            "userInfo": {
                "custId": "",
            },
        }
    }

    public generatePaytmTxnToken = async (paytmChecksumEntity: PaytmChecksumEntity) => {
        this.setParams(paytmChecksumEntity);
        let checkSum = await this.paytmchecksum.generateSignature(JSON.stringify(this.paytmParamsBody), this.merchantKey);
        let paytmTxnToken = await this.callPaymtm(checkSum);
        return paytmTxnToken;
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
            let url = this.urlStag + "theia/api/v1/initiateTransaction?mid=weoglH66146360524361&orderId=" + this.paytmParamsBody.orderId;
            let response = await httpPostServiceIns(url).setPayload(paytmParams).call();
            console.log(response);
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