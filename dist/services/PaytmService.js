"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paytmServiceIns = void 0;
const paytmchecksum_1 = __importDefault(require("paytmchecksum"));
const HttpPostService_1 = require("@app/http-services/HttpPostService");
class PaytmService {
    /**
     *
     */
    constructor() {
        this.urlProd = "securegw.paytm.in/";
        this.urlStag = "https://securegw-stage.paytm.in/";
        this.merchantKey = "t%6_v!wV#lymlZpr";
        this.generatePaytmTxnToken = (paytmChecksumEntity) => __awaiter(this, void 0, void 0, function* () {
            this.setParams(paytmChecksumEntity);
            let checkSum = yield this.paytmchecksum.generateSignature(JSON.stringify(this.paytmParamsBody), this.merchantKey);
            let paytmTxnToken = yield this.callPaymtm(checkSum);
            return paytmTxnToken;
        });
        this.isPaytmCheckSumValid = (paytmResponse) => {
            let paytmCheckSum = paytmResponse.CHECKSUMHASH;
            console.log("paytmCheckSum", paytmCheckSum);
            delete paytmResponse.CHECKSUMHASH;
            let isPaytmCheckSumValid = this.paytmchecksum.verifySignature(paytmResponse, this.merchantKey, paytmCheckSum);
            console.log("isPaytmCheckSumValid", isPaytmCheckSumValid);
            return isPaytmCheckSumValid;
        };
        this.callPaymtm = (checkSum) => __awaiter(this, void 0, void 0, function* () {
            try {
                let paytmParams = { head: { "signature": checkSum }, body: this.paytmParamsBody };
                let url = this.urlStag + "theia/api/v1/initiateTransaction?mid=weoglH66146360524361&orderId=" + this.paytmParamsBody.orderId;
                let response = yield HttpPostService_1.httpPostServiceIns(url).setPayload(paytmParams).call();
                console.log(response);
                return response;
            }
            catch (error) {
                console.log(error);
            }
        });
        this.setParams = (paytmChecksumEntity) => {
            this.paytmParamsBody.txnAmount.value = paytmChecksumEntity.amount;
            this.paytmParamsBody.userInfo.custId = paytmChecksumEntity.userId;
            this.paytmParamsBody.orderId = paytmChecksumEntity.orderId;
        };
        this.paytmchecksum = paytmchecksum_1.default;
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
        };
    }
}
exports.paytmServiceIns = new PaytmService();
//# sourceMappingURL=PaytmService.js.map