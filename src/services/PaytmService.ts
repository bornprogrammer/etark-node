
import paytmchecksum from 'paytmchecksum';
import { PaytmChecksumEntity } from '@app/entities/PaytmChecksumEntity';
import { httpPostServiceIns } from '@app/http-services/HttpPostService';
import config from 'config';
import { AppConstants } from '@app/constants/AppConstants';
import { PaytmRefundParamsEntity } from '@app/entities/PaytmRefundParamsEntity';
import { UtilsHelper } from '@app/helpers/UtilsHelper';

class PaytmService {

    private paytmchecksum: any;
    private paytmParamsBody: any
    private refundParamsBody: any
    private mid: string;
    private paytmURL: string;// = "https://securegw-stage.paytm.in/";
    private merchantKey: string;// = "t%6_v!wV#lymlZpr";
    /**
     *
     */
    constructor() {
        this.paytmchecksum = paytmchecksum;
        this.paytmURL = config.get("paytm.url");
        this.mid = config.get("paytm.merchant_id");
        this.merchantKey = config.get("paytm.merchant_key");
        this.paytmParamsBody = {
            "requestType": "Payment",
            // "mid": "weoglH66146360524361",
            "mid": this.mid,
            "websiteName": config.get("paytm.websiteName"),
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
        let url = AppConstants.SERVER_BASE_URL + "/api/user-plan/paytm-callback";
        return url;
    }

    private getCallbackForProcessTransaction = () => {
        let url = AppConstants.SERVER_BASE_URL + "/api/sc/payment/paytm-callback";
        return url;
    }

    public generatePaytmTxnToken = async (paytmChecksumEntity: PaytmChecksumEntity) => {
        let paytmParamsBody = this.setParams(paytmChecksumEntity);
        let checkSum = await this.paytmchecksum.generateSignature(JSON.stringify(paytmParamsBody), this.merchantKey);
        let paytmTxnToken = await this.callPaymtm(checkSum, paytmParamsBody);
        return paytmTxnToken;
    }

    public callProcessTransaction = async (paytmChecksumEntity: PaytmChecksumEntity) => {
        let payload: any = Object.assign({}, paytmChecksumEntity);
        payload.splitSettlementInfo = {
            "splitMethod": "AMOUNT",
            "splitInfo": [
                {
                    "mid": paytmChecksumEntity.vendorId,
                    "amount": {
                        "value": paytmChecksumEntity.amount,
                        "currency": "INR"
                    }
                }
            ]
        };
        let processTransactionResp = await this.generatePaytmTxnToken(payload);
        return processTransactionResp;
    }

    public generatePaytmTxnTokenForRefund = async (params: PaytmRefundParamsEntity) => {
        let refundParamsBody = await this.getRefundBody(params);
        let checkSum = await this.paytmchecksum.generateSignature(JSON.stringify(refundParamsBody), this.merchantKey);
        console.log("refund checksome", checkSum);
        let paytmTxnToken = await this.refund(checkSum, refundParamsBody);
        return paytmTxnToken;
    }

    public refund = async (checkSum: string, body: any) => {
        try {
            let paytmParams = { head: { "signature": checkSum }, body: body };
            let url = this.paytmURL + "refund/apply";
            let response = await httpPostServiceIns(url).setPayload(paytmParams).call();
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    public processTransaction = async (paytmParams: any) => {
        try {
            let url = this.paytmURL + "theia/api/v1/processTransaction?mid=" + this.mid + "&orderId=" + paytmParams.body.orderId;
            let response = await httpPostServiceIns(url).setPayload(paytmParams).call();
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    private getRefundBody = async (params: PaytmRefundParamsEntity) => {
        let refundBody = { mid: this.mid, txnType: "REFUND", orderId: params.orderId, txnId: params.txnId, refId: params.refundId, refundAmount: params.amount };
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

    private callPaymtm = async (checkSum: string, paytmParamsBody: any) => {
        try {
            let paytmParams = { head: { "signature": checkSum }, body: paytmParamsBody };
            let url = this.paytmURL + "theia/api/v1/initiateTransaction?mid=" + this.mid + "&orderId=" + paytmParamsBody.orderId;
            let response = await httpPostServiceIns(url).setPayload(paytmParams).call();
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    private setParams = (paytmChecksumEntity: PaytmChecksumEntity) => {
        let paytmParamsBody = Object.assign({}, this.paytmParamsBody);
        paytmParamsBody.txnAmount.value = paytmChecksumEntity.amount;
        paytmParamsBody.userInfo.custId = paytmChecksumEntity.userId;
        paytmParamsBody.orderId = paytmChecksumEntity.orderId;
        if (paytmChecksumEntity.splitSettlementInfo) {
            paytmParamsBody.splitSettlementInfo = paytmChecksumEntity.splitSettlementInfo;
        }
        if (paytmChecksumEntity.vendorId) {
            paytmParamsBody.callbackUrl = this.getCallbackForProcessTransaction();
        }
        return paytmParamsBody;
    }
}

export const paytmServiceIns = new PaytmService();