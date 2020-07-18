import IPaytmPayoutResponse from '@app/interfaces/service-reponses/CashfreeService.ts/IPaytmPayoutResponse';
import { CashfreeApiLogRepository } from '@app/repositories/CashfreeApiLogRepository';
import request from 'promise-request-retry';

export default class CashfreeService {

    public static readonly REQUEST_TRANSFER_STATUS = {
        SUCCESS: 'SUCCESS',
        ERROR: 'ERROR',
        PENDING: 'PENDING',
        REVERSED: 'REVERSED',
        FAILED: 'FAILED',
    };

    private static readonly REQUEST_METHODS = {
        GET: 'GET',
        POST: 'POST',
    };

    private static readonly API_URLS = {
        AUTHORIZE: '/payout/v1/authorize',
        BATCH_TRANSFER: '/payout/v1/requestBatchTransfer',
        BATCH_TRANSFER_STATUS: '/payout/v1/getBatchTransferStatus',
        ADD_BENEFICIARY: '/payout/v1/addBeneficiary',
        REQUEST_TRANSFER: '/payout/v1/requestTransfer',
        TRANSFER_STATUS: '/payout/v1/getTransferStatus',
    };

    private static readonly BATCH_FORMATS = {
        BANK_ACCOUNT: 'BANK_ACCOUNT',
    };

    private static STATUS_CODES = {
        CONFLICT: '409',
        SUCCESS: '200',
    };

    private cashfreeApiLogRepository: CashfreeApiLogRepository;

    private authToken = {
        token: null,
        expiry: null,
    };

    constructor(
        cashfreeApiLogRepository: CashfreeApiLogRepository,
    ) {
        this.cashfreeApiLogRepository = cashfreeApiLogRepository;
    }

    public bulkBankPayouts = async (batchTransferId, batch: any[], options) => {

        const response = await this.cashfreeApiCall(
            CashfreeService.REQUEST_METHODS.POST,
            CashfreeService.API_URLS.BATCH_TRANSFER,
            {
                batchTransferId,
                batchFormat: CashfreeService.BATCH_FORMATS.BANK_ACCOUNT,
                deleteBene: 1,
                batch,
            },
        );

        if (response.data && response.data.referenceId) {
            return response.data.referenceId;
        } else {
            const err = new Error(`batch Bank Payouts failed. Response : ${JSON.stringify(response)}`);
            err.name = 'CashfreeError';
            throw err;
        }
    }

    public addPaytmBeneficiary = async (phone, name, email) => {

        const beneficiaryId = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);

        const response = await this.cashfreeApiCall(
            CashfreeService.REQUEST_METHODS.POST,
            CashfreeService.API_URLS.ADD_BENEFICIARY,
            {
                beneId: beneficiaryId,
                name,
                email,
                phone,
                address1: 'ADDRESS PLACEHOLDER',
            },
        );

        if (response.subCode && response.subCode === CashfreeService.STATUS_CODES.SUCCESS) {
            return beneficiaryId;
        } else {
            const err = new Error(`Add paytm beneficiary failed. Response: ${JSON.stringify(response)}`);
            err.name = 'CashfreeError';
            throw err;
        }
    }

    public paytmPayout = async (transferId, beneficiaryId, amount): Promise<IPaytmPayoutResponse> => {
        const response = await this.cashfreeApiCall(
            CashfreeService.REQUEST_METHODS.POST,
            CashfreeService.API_URLS.REQUEST_TRANSFER,
            {
                beneId: beneficiaryId,
                amount,
                transferId,
                transferMode: 'paytm',
            },
        );

        if (response.subCode &&
            response.data &&
            response.data.referenceId &&
            response.subCode === CashfreeService.STATUS_CODES.SUCCESS
        ) {
            return {
                referenceId: response.data.referenceId,
                status: response.status,
            };
        } else {
            const err = new Error(`Paytm payout failed. Response: ${JSON.stringify(response)}`);
            err.name = 'CashfreeError';
            throw err;
        }
    }

    public getBulkPayoutStatus = async (batchTransferId) => {
        const url = `${CashfreeService.API_URLS.BATCH_TRANSFER_STATUS}?batchTransferId=${batchTransferId}`;

        const response = await this.cashfreeApiCall(
            CashfreeService.REQUEST_METHODS.GET,
            url,
        );

        if (response.subCode && response.subCode === CashfreeService.STATUS_CODES.SUCCESS && response.data) {
            return response.data;
        } else {
            const err = new Error(`Failed to get bulk/batch payout status. Response: ${JSON.stringify(response)}`);
            err.name = 'CashfreeError';
            throw err;
        }
    }

    public getPayoutStatus = async (transferId, referenceId) => {
        const url = `${CashfreeService.API_URLS.TRANSFER_STATUS}?` +
                    `referenceId=${referenceId}&transferId=${transferId}`;

        const response = await this.cashfreeApiCall(
            CashfreeService.REQUEST_METHODS.GET,
            url,
        );

        if (response.subCode && response.subCode === CashfreeService.STATUS_CODES.SUCCESS &&
            response.data && response.data.transfer && response.data.transfer.status
        ) {
            return response.data.transfer.status;
        } else {
            const err = new Error(`Failed to get payout status. Response: ${JSON.stringify(response)}`);
            err.name = 'CashfreeError';
            throw err;
        }
    }

    public authorize = async () => {
        if (this.authToken && this.authToken.expiry) {
            const currentTime = (new Date()).getTime() / 1000;
            const diff = (this.authToken.expiry - currentTime);
            if (diff > 20) {
                return;
            }
        }
        const response = await this.cashfreeApiCall(
            CashfreeService.REQUEST_METHODS.POST,
            CashfreeService.API_URLS.AUTHORIZE,
        );

        if (response.subCode &&
            response.subCode === CashfreeService.STATUS_CODES.SUCCESS &&
            response.data && response.data.token
        ) {
            this.authToken = response.data;
        } else {
            const err = new Error(`Cashfree authorization failed. Response: ${JSON.stringify(response)}`);
            err.name = 'CashfreeError';
            throw err;
        }
    }

    public cashfreeApiCall = async (requestMethod, url, requestBody = {}, otherData = {}) => {

        try {
            let headers = {};
            if (url === CashfreeService.API_URLS.AUTHORIZE) {
                headers = {
                    'X-Client-Id': process.env.CASHFREE_CLIENT_ID,
                    'X-Client-Secret': process.env.CASHFREE_CLIENT_SECRET,
                };
            } else {
                await this.authorize();
                headers = {
                    Authorization: `Bearer ${this.authToken.token}`,
                };
            }

            const httpRequestOptions = {
                headers,
                resolveWithFullResponse: true,
                uri: `${process.env.CASHFREE_HOST}${url}`,
                method: requestMethod,
                body: JSON.stringify(requestBody),
            };

            const response = await request(httpRequestOptions);
            const parsedResponse = JSON.parse(response.body);

            await this.cashfreeApiLogRepository.create({
                request: `${requestMethod} ${url} - ${JSON.stringify(requestBody)}`,
                response: response.body,
                data: JSON.stringify(otherData),
            });

            return parsedResponse;

        } catch (error) {

            await this.cashfreeApiLogRepository.create({
                request: `${requestMethod} ${url} - ${JSON.stringify(requestBody)}`,
                response: error.stack,
                data: JSON.stringify(otherData),
            });

            if (error.name !== 'CashfreeError') {
                const err = new Error('Cashfree API request failed');
                err.name = 'CashfreeError';
                throw err;
            }
            throw error;
        }
    }

}
