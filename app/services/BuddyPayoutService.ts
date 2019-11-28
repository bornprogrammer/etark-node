import BuddyPayoutCronJobConstants from '@app/constants/BuddyPayoutCronJobConstants';
import CashfreeBatchPayoutConstants from '@app/constants/CashfreeBatchPayoutConstants';
import CashfreeBuddyPayoutConstants from '@app/constants/CashfreeBuddyPayoutConstants';
import CashfreeConstants from '@app/constants/CashfreeConstants';
import IPaytmPayoutResponse from '@app/interfaces/service-reponses/CashfreeService.ts/IPaytmPayoutResponse';
import {
    AccountTransactionsRepository,
    BuddyAccountTransactionsRepository,
    BuddyPayoutCronJobsRepository,
    BuddyPayoutMissingAccountsRepository,
    CashfreeBatchPayoutRepository,
    CashfreeBuddyPayoutRepository,
    UserAccountsRepository,
} from '@app/repositories';
import { OldUserAccountsRepository } from '@app/repositories/OldUserAccountsRepository';
import CashfreeService from './CashfreeService';
import Logger from './Logger';

export default class BuddyPayoutService {

    // following constant can refer to constants from cashfreeservice and CashfreeBuddyPayoutConstants files
    private static readonly CASHFREE_BUDDY_PAYOUT_STATUS_MAP = {
        SUCCESS: 1,
        PENDING: 2,
        ERROR: 3,
        FAILED: 4,
        REVERSED: 5,
        QUEUED: 6,
    };
    private buddyPayoutCronJobsRepository: BuddyPayoutCronJobsRepository;
    private userAccountsRepository: UserAccountsRepository;
    private cashfreeBuddyPayoutRepository: CashfreeBuddyPayoutRepository;
    private buddyPayoutMissingAccountsRepository: BuddyPayoutMissingAccountsRepository;
    private cashfreeBatchPayoutRepository: CashfreeBatchPayoutRepository;
    private buddyAccountTransactionsRepository: BuddyAccountTransactionsRepository;
    private oldUserAccountsRepository: OldUserAccountsRepository;
    private accountTransactionsRepository: AccountTransactionsRepository;
    private cashfreeService: CashfreeService;

    public constructor(
        buddyPayoutCronJobsRepository: BuddyPayoutCronJobsRepository,
        userAccountsRepository: UserAccountsRepository,
        cashfreeBuddyPayoutRepository: CashfreeBuddyPayoutRepository,
        buddyPayoutMissingAccountsRepository: BuddyPayoutMissingAccountsRepository,
        cashfreeBatchPayoutRepository: CashfreeBatchPayoutRepository,
        buddyAccountTransactionsRepository: BuddyAccountTransactionsRepository,
        oldUserAccountsRepository: OldUserAccountsRepository,
        accountTransactionsRepository: AccountTransactionsRepository,
        cashfreeService: CashfreeService,
    ) {
        this.buddyPayoutCronJobsRepository = buddyPayoutCronJobsRepository;
        this.userAccountsRepository = userAccountsRepository;
        this.cashfreeBuddyPayoutRepository = cashfreeBuddyPayoutRepository;
        this.buddyPayoutMissingAccountsRepository = buddyPayoutMissingAccountsRepository;
        this.cashfreeBatchPayoutRepository = cashfreeBatchPayoutRepository;
        this.buddyAccountTransactionsRepository = buddyAccountTransactionsRepository;
        this.oldUserAccountsRepository = oldUserAccountsRepository;
        this.accountTransactionsRepository = accountTransactionsRepository;
        this.cashfreeService = cashfreeService;
    }

    public processBuddyPayouts = async (accountsUpdatedAfter: string) => {
        const payoutJob = await this.buddyPayoutCronJobsRepository.create({});
        await this.queuePayouts(payoutJob);
        const bankTransfersSummary = await this.processBankTransfers(payoutJob);
        const paytmTransfersSummary = await this.processPaytmTransfers(payoutJob);

        payoutJob.status = BuddyPayoutCronJobConstants.STATUS.INITIATED;
        await payoutJob.save();

        return {cronJobId: payoutJob.id, paytmTransfersSummary, bankTransfersSummary};
    }

    public updatePayoutsStatus = async () => {
        const jobsToProcess: any = await this.buddyPayoutCronJobsRepository.findLast2();
        const processingSummary = [];

        for (const jobToProcess of jobsToProcess) {
            await this.fetchAndUpdateBulkPayoutsStatus(jobToProcess);
            await this.fetchAndUpdatePaytmPayouts(jobToProcess.id);

            jobToProcess.successfullBankTransfers = await this.cashfreeBuddyPayoutRepository
                .findSuccessfullBankTransfersCount(jobToProcess.id);
            jobToProcess.unsuccessfullBankTransfers = jobToProcess.totalBankTransfers -
                jobToProcess.successfullBankTransfers;

            jobToProcess.successfullPaytmTransfers = await this.cashfreeBuddyPayoutRepository
                .findSuccessfullPaytmTransfersCount(jobToProcess.id);
            jobToProcess.unsuccessfullPaytmTransfers = jobToProcess.totalPaytmTransfers -
                jobToProcess.successfullPaytmTransfers;

            jobToProcess.status = BuddyPayoutCronJobConstants.STATUS.PROCESSED;

            const successProcessResult = await this.addSuccessTransfersToAccounts(jobToProcess.id);
            const failureProcessResult = await this.removeFailedTransfersFromAccounts(jobToProcess.id);

            processingSummary.push({cronJobId: jobToProcess.id, successProcessResult, failureProcessResult });

            await jobToProcess.save();
        }
        return processingSummary;
    }

    public queuePayouts = async (payoutJob) => {

        let idGreaterThan = 0;
        const batchSize = 500;
        let totalEligibleTransfers: number = 0;
        let usersWithoutPaymentDetails: number = 0;
        let totalBankTransfers: number = 0;
        let totalPaytmTransfers: number = 0;

        while (true) {

            const accounts = await this.userAccountsRepository.findAllWithPendingAmountFromFb(
                idGreaterThan,
                batchSize,
            );

            if (accounts.length === 0) {
                break;
            }

            for (const account of accounts) {

                idGreaterThan = account.id;
                totalEligibleTransfers++;

                if (account.accountNumber) {
                    totalBankTransfers++;
                    this.cashfreeBuddyPayoutRepository.create({
                        userId: account.userId,
                        bankAccountId: account.userBankAccountId,
                        paytmAccountId: null,
                        credit: account.credit,
                        debit: account.debit,
                        amount: account.amount,
                        status: CashfreeBuddyPayoutConstants.STATUS.UNPROCESSED,
                        cronJobId: payoutJob.id,
                        cashfreeTransferId: Math.random().toString(36).substring(2) +
                                            (new Date()).getTime().toString(36),
                    });
                } else if (account.paytmPhoneNumber) {
                    totalPaytmTransfers++;
                    this.cashfreeBuddyPayoutRepository.create({
                        userId: account.userId,
                        bankAccountId: null,
                        paytmAccountId: account.userPaytmAccountId,
                        credit: account.credit,
                        debit: account.debit,
                        amount: account.amount,
                        status: CashfreeBuddyPayoutConstants.STATUS.UNPROCESSED,
                        cronJobId: payoutJob.id,
                        cashfreeTransferId: Math.random().toString(36).substring(2) +
                                            (new Date()).getTime().toString(36),
                    });
                } else {
                    usersWithoutPaymentDetails++;
                    this.buddyPayoutMissingAccountsRepository.create({
                        userId: account.userId,
                        cronJobId: payoutJob.id,
                    });
                }
            }
        }

        payoutJob.totalEligibleTransfers = totalEligibleTransfers;
        payoutJob.usersWithoutPaymentDetails = usersWithoutPaymentDetails;
        payoutJob.totalBankTransfers = totalBankTransfers;
        payoutJob.totalPaytmTransfers = totalPaytmTransfers;
        payoutJob.save();
    }

    public processBankTransfers = async (payoutJob) => {
        let idGreaterThan = 0;
        const batchSize = 100;

        let successCounts = 0;
        let failureCounts = 0;
        const failures = [];

        while (true) {
            const batchTransfers = [];
            const buddyPayoutIds = [];
            const bankTransactions = await this.cashfreeBuddyPayoutRepository
                                            .findAllBankTransfersByCronJobId(payoutJob.id, idGreaterThan, batchSize);

            if (bankTransactions.length > 0) {

                for (const bankTransaction of bankTransactions) {
                    batchTransfers.push({
                        transferId: bankTransaction.cashfreeTransferId,
                        amount: bankTransaction.amount,
                        bankAccount: bankTransaction.UserBankAccount.accountNumber,
                        ifsc: bankTransaction.UserBankAccount.ifsc,
                        email: bankTransaction.user.emailId,
                        name: bankTransaction.UserBankAccount.accountHolderName,
                        phone: bankTransaction.user.phone,
                    });
                    buddyPayoutIds.push(bankTransaction.id);
                    idGreaterThan = bankTransaction.id;
                    await this.creditUserAccount(bankTransaction);
                }

                try {
                    const batchTransferId = Math.random().toString(36).substring(2) +
                                            (new Date()).getTime().toString(36);

                    const referenceId = await this.cashfreeService.bulkBankPayouts(
                        batchTransferId,
                        batchTransfers,
                        {cronJobId: payoutJob.id},
                    );

                    const cashfreeBatchPayout = await this.cashfreeBatchPayoutRepository.create({
                        totalTransactionsCount: batchTransfers.length,
                        referenceId,
                        batchTransferId,
                        cronJobId: payoutJob.id,
                    });

                    await this.cashfreeBuddyPayoutRepository.updateCashfreeBatchPayoutIds(
                        buddyPayoutIds,
                        cashfreeBatchPayout.id,
                    );

                    successCounts++;
                } catch (error) {
                    failures.push(error.stack);
                    failureCounts++;
                    for (const bankTransaction of bankTransactions) {
                        await this.reverseTransaction(bankTransaction);
                    }
                }

            } else {
                break;
            }
        }

        return {successCounts, failureCounts, failures};
    }

    // loops through all the paytm payouts for a payout cron job, processes them and updates the status
    public processPaytmTransfers = async (payoutJob) => {
        let idGreaterThan = 0;
        const batchSize = 500;

        let successCounts = 0;
        let failureCounts = 0;
        let pendingCounts = 0;
        const failures = [];

        while (true) {
            const paytmTransactions = await this.cashfreeBuddyPayoutRepository
                                            .findAllPaytmTransfersByCronJobId(payoutJob.id, idGreaterThan, batchSize);

            if (paytmTransactions.length > 0) {

                for (const paytmTransaction of paytmTransactions) {

                    try {
                        const payoutResponse = await this.processPaytmPayout(paytmTransaction);

                        switch (payoutResponse.status) {
                            case CashfreeService.REQUEST_TRANSFER_STATUS.SUCCESS:
                                paytmTransaction.status = CashfreeBuddyPayoutConstants.STATUS.SUCCESSFUL;
                                successCounts++;
                                await this.creditUserAccount(paytmTransaction);
                                break;

                            case CashfreeService.REQUEST_TRANSFER_STATUS.PENDING:
                                paytmTransaction.status = CashfreeBuddyPayoutConstants.STATUS.PENDING;
                                pendingCounts++;
                                await this.creditUserAccount(paytmTransaction);
                                break;
                        }

                        paytmTransaction.referenceId = payoutResponse.referenceId;

                    } catch (error) {
                        paytmTransaction.status = CashfreeBuddyPayoutConstants.STATUS.FAILED;
                        paytmTransaction.failureReason = error.stack;
                        failures.push(error.stack);
                        failureCounts++;
                    }

                    paytmTransaction.save();
                    idGreaterThan = paytmTransaction.id;
                }

            } else {
                break;
            }
        }

        return {successCounts, pendingCounts, failureCounts, failures};
    }

    // this method takes an instance of cashfreebuddypayout created to record paytm transfer
    // it creates the beneficiary if required and requests paytm tranfer
    public processPaytmPayout = async (cashfreeBuddyPayout) => {
        let payoutResponse: IPaytmPayoutResponse;

        if (cashfreeBuddyPayout.UserPaytmAccount.cashfreeBeneficiaryId) {
            payoutResponse = await this.cashfreeService.paytmPayout(
                cashfreeBuddyPayout.cashfreeTransferId,
                cashfreeBuddyPayout.UserPaytmAccount.cashfreeBeneficiaryId,
                cashfreeBuddyPayout.amount,
            );
        } else {

            const beneficiaryId = await this.cashfreeService.addPaytmBeneficiary(
                cashfreeBuddyPayout.UserPaytmAccount.phone,
                cashfreeBuddyPayout.user.name,
                cashfreeBuddyPayout.user.emailId,
            );

            cashfreeBuddyPayout.UserPaytmAccount.cashfreeBeneficiaryId = beneficiaryId;
            cashfreeBuddyPayout.UserPaytmAccount.save();

            payoutResponse = await this.cashfreeService.paytmPayout(
                cashfreeBuddyPayout.cashfreeTransferId,
                cashfreeBuddyPayout.UserPaytmAccount.cashfreeBeneficiaryId,
                cashfreeBuddyPayout.amount,
            );
        }

        return payoutResponse;
    }

    /*
     * get the transfer status for all the bulk/batch transfer requests from cashfree and
     * update the status for each transaction in DB
     */
    public fetchAndUpdateBulkPayoutsStatus = async (jobToProcess) => {

        const batchPayouts = jobToProcess.CashfreeBatchPayouts;
        for (const batchPayout of batchPayouts) {
            const bulkPayoutStatus = await this.cashfreeService.getBulkPayoutStatus(batchPayout.batchTransferId);

            // log if there is any mismatch. this should ideally never happen
            if (bulkPayoutStatus.referenceId !== batchPayout.referenceId ||
                batchPayout.CashfreeBuddyPayouts.length !== bulkPayoutStatus.rowCount
            ) {
                Logger.error(`cashfreeService getBulkPayoutStatus reference or ` +
                    `rowCount mismatch. Cron Job Id: ${jobToProcess.id}`);
            }

            // get transfer status for each transfer in hashmap where key is transferId for easy and efficient access
            const bulkPayoutTransferStatus = [];
            for (const transfer of bulkPayoutStatus.transfers) {
                bulkPayoutTransferStatus[transfer.transferId] = transfer;
            }

            let successfullTransactionsCount = 0;
            let failedTransactionsCount = 0;

            for (const cashfreeBuddyPayout of batchPayout.CashfreeBuddyPayouts) {
                const transferStatus = bulkPayoutTransferStatus[cashfreeBuddyPayout.cashfreeTransferId];

                if (!transferStatus) {
                    Logger.error(`BuddyPayoutService: Transfer status not found for ` +
                            `transfer Id: ${cashfreeBuddyPayout.cashfreeTransferId}`);

                    cashfreeBuddyPayout.status = CashfreeBuddyPayoutConstants.STATUS.FAILED;
                    cashfreeBuddyPayout.failureReason = 'Transfer status not found';
                    cashfreeBuddyPayout.save();
                    failedTransactionsCount++;
                    continue;
                }

                if (transferStatus.status && transferStatus.status === 'SUCCESS') {
                    if (!transferStatus.referenceId) {
                        Logger.error(`BuddyPayoutService: referenceId for a success transfer not found ` +
                            `transfer Id: ${cashfreeBuddyPayout.cashfreeTransferId}`);
                    } else {
                        cashfreeBuddyPayout.cashfreeReferenceId = transferStatus.referenceId;
                    }
                    cashfreeBuddyPayout.status = CashfreeBuddyPayoutConstants.STATUS.SUCCESSFUL;
                    successfullTransactionsCount++;
                } else {
                    if (!transferStatus.failureReason) {
                        Logger.error(`BuddyPayoutService: failure reason not found for an unsuccessfull transfer ` +
                            `transfer Id: ${cashfreeBuddyPayout.cashfreeTransferId}`);
                    } else {
                        cashfreeBuddyPayout.failureReason = transferStatus.failureReason;
                    }

                    if (!transferStatus.referenceId) {
                        Logger.error(`BuddyPayoutService: referenceId for a unsuccessfull transfer not found ` +
                            `transfer Id: ${cashfreeBuddyPayout.cashfreeTransferId}`);
                    } else {
                        cashfreeBuddyPayout.cashfreeReferenceId = transferStatus.referenceId;
                    }

                    if (!transferStatus.status) {
                        Logger.error(`BuddyPayoutService: transfer status not found ` +
                            `transfer Id: ${cashfreeBuddyPayout.cashfreeTransferId}`);
                        cashfreeBuddyPayout.status = CashfreeBuddyPayoutConstants.STATUS.FAILED;
                    } else {
                        cashfreeBuddyPayout.status = BuddyPayoutService
                            .CASHFREE_BUDDY_PAYOUT_STATUS_MAP[transferStatus.status];
                    }

                    failedTransactionsCount++;
                }
                cashfreeBuddyPayout.save();
            }

            batchPayout.successfullTransactionsCount = successfullTransactionsCount;
            batchPayout.failedTransactionsCount = failedTransactionsCount;
            batchPayout.status = CashfreeBatchPayoutConstants.STATUS.PROCESSED;
            batchPayout.save();
        }
    }

    public fetchAndUpdatePaytmPayouts = async (cronJobId) => {
        const idGreaterThan = 0;
        const batchSize = 500;

        const pendingPaytmTransfers = await this.cashfreeBuddyPayoutRepository
                                            .findAllPaytmTransfersByCronJobId(
                                                cronJobId,
                                                idGreaterThan,
                                                batchSize,
                                                CashfreeBuddyPayoutConstants.STATUS.PENDING,
                                            );

        for (const pendingPaytmTransfer of pendingPaytmTransfers) {
            try {
                const status = await this.cashfreeService.getPayoutStatus(
                    pendingPaytmTransfer.transferId,
                    pendingPaytmTransfer.referenceId,
                );
                pendingPaytmTransfer.status = BuddyPayoutService.CASHFREE_BUDDY_PAYOUT_STATUS_MAP[status];
            } catch (error) {
                pendingPaytmTransfer.status = CashfreeBuddyPayoutConstants.STATUS.ERROR;
                pendingPaytmTransfer.failureReason = error.stack;
            }
            pendingPaytmTransfer.save();
        }
    }

    public addSuccessTransfersToAccounts = async (cronJobId) => {
        let idGreaterThan = 0;
        const batchSize = 500;

        let createdCount = 0;
        let failedCounts = 0;

        while (true) {
            const successTransactions = await this.cashfreeBuddyPayoutRepository
                .findNonAccountedSuccessTransfersByCronJobId(cronJobId, idGreaterThan, batchSize);

            if (successTransactions.length > 0) {

                for (const successTransaction of successTransactions) {
                    try {
                        await this.creditUserAccount(successTransaction);
                        createdCount++;
                    } catch (error) {
                        Logger.error(error.stack);
                        failedCounts++;
                    }
                    idGreaterThan = successTransaction.id;
                }

            } else {
                break;
            }
        }

        return {createdCount, failedCounts};
    }

    public removeFailedTransfersFromAccounts = async (cronJobId) => {
        let idGreaterThan = 0;
        const batchSize = 500;

        let removedCount = 0;
        let failedCounts = 0;

        while (true) {
            const FailedTransactions = await this.cashfreeBuddyPayoutRepository
                .findFailedTransfersByCronJobId(cronJobId, idGreaterThan, batchSize);

            if (FailedTransactions.length > 0) {

                for (const failedTransaction of FailedTransactions) {
                    try {
                        await this.reverseTransaction(failedTransaction);
                        removedCount++;
                    } catch (error) {
                        Logger.error(error.stack);
                        failedCounts++;
                    }
                    idGreaterThan = failedTransaction.id;
                }

            } else {
                break;
            }
        }

        return {removedCount, failedCounts};
    }

    public creditUserAccount = async (cashfreeBuddyPayout) => {
        // TODO: use transaction in the code below
        if (!cashfreeBuddyPayout.buddyAccountTransactionId) {
            const buddyAccTransaction = await this.buddyAccountTransactionsRepository.create({
                userId: cashfreeBuddyPayout.userId,
                credit: cashfreeBuddyPayout.credit,
                debit: cashfreeBuddyPayout.debit,
            });
            cashfreeBuddyPayout.buddyAccountTransactionId = buddyAccTransaction.id;
            cashfreeBuddyPayout.save();
        }

        if (!cashfreeBuddyPayout.accountTransactionId) {
            const oldUserAccount = await this.oldUserAccountsRepository.findOneByAttributes({
                user_id: cashfreeBuddyPayout.userId,
            });
            const accTransaction = await this.accountTransactionsRepository.create({
                accountId: oldUserAccount.id,
                credit: cashfreeBuddyPayout.credit,
                debit: cashfreeBuddyPayout.debit,
            });
            cashfreeBuddyPayout.accountTransactionId = accTransaction.id;
            cashfreeBuddyPayout.save();
        }
    }

    public handleCashfreeEvents = async (payload) => {
        const cashfreeBuddyPayout = await this.cashfreeBuddyPayoutRepository.findByAttributes(payload.transferId);

        if (cashfreeBuddyPayout) {
            if (payload.event === CashfreeConstants.EVENTS.TRANSFER_SUCCESS) {
                await cashfreeBuddyPayout.updateAttributes({
                    status: CashfreeBuddyPayoutConstants.STATUS.SUCCESSFUL,
                    cashfreeReferenceId: payload.referenceId,
                });
            } else if (payload.event === CashfreeConstants.EVENTS.TRANSFER_FAILED) {
                await cashfreeBuddyPayout.updateAttributes({
                    status: CashfreeBuddyPayoutConstants.STATUS.FAILED,
                    failureReason: payload.reason,
                    cashfreeReferenceId: payload.referenceId,
                });
                await this.reverseTransaction(cashfreeBuddyPayout);
            } else if (payload.event === CashfreeConstants.EVENTS.TRANSFER_REVERSED) {
                await cashfreeBuddyPayout.updateAttributes({
                    status: CashfreeBuddyPayoutConstants.STATUS.REVERSED,
                    cashfreeReferenceId: payload.referenceId,
                });
                await this.reverseTransaction(cashfreeBuddyPayout);
            }
        }
    }

    public reverseTransaction = async (cashfreeBuddyPayout) => {

        Logger.error(`reversing cashfreeBuddyPayoutId - ${cashfreeBuddyPayout.id}, ` +
                    `buddyAccountTransactionId - ${cashfreeBuddyPayout.buddyAccountTransactionId}, ` +
                    `accountTransactionId - ${cashfreeBuddyPayout.accountTransactionId}`);

        // get ids of rows to delete from transactions
        const buddyAccountTransactionId = cashfreeBuddyPayout.buddyAccountTransactionId;
        const accountTransactionId = cashfreeBuddyPayout.accountTransactionId;

        if (buddyAccountTransactionId || accountTransactionId) {
            await cashfreeBuddyPayout.updateAttributes({
                accountTransactionId: null,
                buddyAccountTransactionId: null,
            });

            await this.buddyAccountTransactionsRepository.deleteByAttributes({
                id: buddyAccountTransactionId,
            });

            await this.accountTransactionsRepository.deleteByAttributes({
                id: accountTransactionId,
            });
        }
    }

}
