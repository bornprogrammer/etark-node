import { AddressEnum } from '@app/enums/AddressEnum';
import { CartItemTypeEnum } from '@app/enums/CartItemTypeEnum';
import { chainingMethodHandlerIns } from '@app/method-handler/ChainingMethodHandler';
import { ChainingMethodParamsEntity } from '@app/method-handler/ChainingMethodParamsEntity';
import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import BaseRepositoryService from '@app/services/BaseRepositoryService';
import { add } from 'winston';
import { shippingRepositoryServiceIns } from '../shipping/ShippingRepositoryService';
import { walletRepositoryServiceIns } from '../fb_wallet/WalletRepositoryService';
import { OrderRepository, orderRepositoryIns } from './OrderRepository';
import { OrderStatusEnum } from '@app/enums/OrderStatusEnum';
import { PaymentModeEnum } from '@app/enums/PaymentModeEnum';
import { WalletSourceEnum } from '@app/enums/WalletSourceEnum';
import { WalletTxnTypeEnum } from '@app/enums/WalletTxnTypeEnum';
import { afterOrderPlacedIns } from './AfterOrderPlaced';
import { ICashFreeEntity } from './ICashFreeEntity';
import { SmsService } from '@app/sms/SmsService';
import { smsFactoryIns } from '@app/sms/SmsFactory';

export class OrderRepositoryService extends BaseRepositoryService {

    constructor(orderRepository: OrderRepository) {
        super(orderRepository);
    }

    public addOrder = async (orderParams) => {
        const walletBalance = await repositoryServiceMethodHandlerIns.setParams(orderParams.user_id).setMethodHandler(this.getWalletBalance).get();
        if (orderParams.is_wallet_amount_used && walletBalance.total > 0) {
            if (parseFloat(orderParams.cart_value) <= walletBalance.total) {
                orderParams.deductBalance = orderParams.cart_value;
                orderParams.orderStatus = OrderStatusEnum.COMPLETED;
                orderParams.paymentMode = PaymentModeEnum.WALLET;
            } else {
                orderParams.deductBalance = walletBalance.total;
                orderParams.orderStatus = OrderStatusEnum.PENDING;
                orderParams.paymentMode = PaymentModeEnum.WALLET_AND_CASHFREE;
            }
        } else {
            orderParams.deductBalance = 0;
            orderParams.orderStatus = OrderStatusEnum.PENDING;
            orderParams.paymentMode = PaymentModeEnum.CASHFREE;
        }
        const result = await chainingMethodHandlerIns().setNextMethodHandlerNPreserveResult(this.mRepository.addOrder, { ...orderParams, ...walletBalance }).setNextMethodHandler(this.deductAndUpdateWalletBalance).setNextMethodHandler(this.addAddress).get();
        const iCashFreeEntityParams: ICashFreeEntity = { orderId: result[0].orderTxnId, orderAmount: result[0].balance_amount_to_be_paid, orderCurrency: 'INR', customerEmail: orderParams.address.email_id, customerPhone: orderParams.address.phone, customerName: orderParams.address.name };
        const result1 = await afterOrderPlacedIns.onAfterOrderPlaced({ orderParams: iCashFreeEntityParams, platformType: orderParams.type, isPaymentModeOnline: result[0].pay_online });
        Object.assign(result[0], result1);
        if (result[0].balance_amount_to_be_paid == 0)
            this.sendSMS({ orderTxnId: result[0].orderTxnId, userId: orderParams.user_id })
        // if (orderParams.type === 'ios' && result[0].pay_online) {
        //     const payload = { orderId: result[0].orderTxnId, orderAmount: result[0].balance_amount_to_be_paid, orderCurrency: 'INR' };
        //     const token = await cfTokenGeneratorServiceIns.generate(payload);
        //     result[0].cftoken = token;
        // }
        // if (orderParams.type === 'web' && result[0].pay_online) {
        //     const payload = { orderId: result[0].orderTxnId, orderAmount: result[0].balance_amount_to_be_paid, orderCurrency: 'INR' };
        //     const token = await cfTokenGeneratorServiceIns.generate(payload);
        //     result[0].cftoken = token;
        // }
        return result[0];
    }

    public deleteOrder = async (params) => {
        const data = await repositoryServiceMethodHandlerIns.setParams(params.orderId).setMethodHandler(this.mRepository.deleteOrder).get();
        const walletData = await repositoryServiceMethodHandlerIns.setParams({ ...params, source: WalletSourceEnum.ORDER_V1 }).setMethodHandler(this.getWalletInfo).get();
        if (walletData.length > 0) {
            if (walletData.find(a => a.txn_type == WalletTxnTypeEnum.CREDIT || a.txn_type == WalletTxnTypeEnum.PROMOTIONS_CREDIT)) {
                return data;
            }
            let debit = walletData.find(a => a.txn_type == WalletTxnTypeEnum.DEBIT);
            if (debit) {
                const walletResult = await repositoryServiceMethodHandlerIns.setParams({ ...params, amount: debit.txn_amount, txn_type: WalletTxnTypeEnum.CREDIT }).setMethodHandler(this.refundAndUpdateWalletBalance).get()
            }
            let promoDebit = walletData.find(a => a.txn_type == WalletTxnTypeEnum.PROMOTIONS_DEBIT)
            if (promoDebit) {
                const walletResult = await repositoryServiceMethodHandlerIns.setParams({ ...params, amount: promoDebit.txn_amount, txn_type: WalletTxnTypeEnum.PROMOTIONS_CREDIT }).setMethodHandler(this.refundAndUpdateWalletBalance).get()
            }
        }
        return data;
    }

    public addAddress = async (chainingMethodParamsEntityObj: ChainingMethodParamsEntity) => {
        let addressResult = null;
        const topParams = chainingMethodParamsEntityObj.getTopParams();
        const address = topParams.address;
        const addressType = topParams.address_type;
        address.order_id = chainingMethodParamsEntityObj.getPreservedResultsContainerByIndex(0).orderId;
        if (addressType === AddressEnum.E_ADDRESS) {
            addressResult = await this.addEAddress(address);
        } else {
            address.user_id = topParams.user_id;
            addressResult = await this.addShippingAddress(address);
        }
    }

    public addShippingAddress = async (shippingAddress) => {
        const shippingAddressResult = await shippingRepositoryServiceIns.addShippingAddress(shippingAddress);
        return shippingAddressResult;
    }

    public addEAddress = async (eAddress) => {
        const eAddressResult = await shippingRepositoryServiceIns.addEAddress(eAddress);
        return eAddressResult;
    }

    public getWalletBalance = async (userId) => {
        const walletBalance = await walletRepositoryServiceIns.getWalletBalance(userId);
        return walletBalance;
    }

    public updateWalletAmount = async (userId) => {
        const updateResult = await walletRepositoryServiceIns.updateWalletAmount(userId);
        return updateResult;
    }

    public getWalletInfo = async (params) => {
        const walletInfo = await walletRepositoryServiceIns.getWalletInfo(params);
        return walletInfo;
    }

    public deductAndUpdateWalletBalance = async (chainingMethodParamsEntityObj: ChainingMethodParamsEntity) => {
        const topParams = chainingMethodParamsEntityObj.getTopParams();
        if (!topParams.is_wallet_amount_used) {
            return true;
        }
        let orderId = chainingMethodParamsEntityObj.getPreservedResultsContainerByIndex(0).orderId;
        if (topParams.promotionalTotal > 0) {
            let amount = topParams.promotionalTotal >= topParams.deductBalance ? topParams.deductBalance : topParams.promotionalTotal;
            const deductBalResult = await walletRepositoryServiceIns.deductOrAddWalletBalance({ user_id: topParams.user_id, source: WalletSourceEnum.ORDER_V1, txn_type: WalletTxnTypeEnum.PROMOTIONS_DEBIT, source_id: orderId, amount });
            topParams.deductBalance -= amount;
        }
        if (topParams.regularTotal > 0 && topParams.deductBalance > 0) {
            const deductBalResult = await walletRepositoryServiceIns.deductOrAddWalletBalance({ user_id: topParams.user_id, source: WalletSourceEnum.ORDER_V1, txn_type: WalletTxnTypeEnum.DEBIT, source_id: orderId, amount: topParams.regularTotal >= topParams.deductBalance ? topParams.deductBalance : topParams.regularTotal });
        }
        const updateResult = await walletRepositoryServiceIns.updateWalletAmount(topParams.user_id);
        return updateResult;
    }

    public refundAndUpdateWalletBalance = async (params) => {
        const deductBalResult = await walletRepositoryServiceIns.deductOrAddWalletBalance({ user_id: params.user_id, source: WalletSourceEnum.ORDER_V1, txn_type: params.txn_type, source_id: params.orderId, amount: params.amount });
        const updateResult = await walletRepositoryServiceIns.updateWalletAmount(params.user_id);
        return updateResult;
    }

    public sendSMS = async (params) => {
        const data = await repositoryServiceMethodHandlerIns.setParams(params).setMethodHandler(this.mRepository.getOrderInfoByOrderId).get();
        console.log(data);
        for (const smsInfo of data) {
            const message = `Your order for ${smsInfo.title} from Chef ${smsInfo.buddy_name} for ${smsInfo.ordered_unit} servings is confirmed and it will be delivered by ${smsInfo.delivery_date}. Your Order id for this order is ${smsInfo.order_id}`;
            console.log(message)
            smsFactoryIns.send({
                mobile_number: smsInfo.phone,
                message
            });
        }

    }

    public getWebOrderInfo = async (orderTxnId) => {
        const walletBalance = await repositoryServiceMethodHandlerIns.setParams(orderTxnId).setMethodHandler(this.mRepository.getWebOrderInfo).get();
        return walletBalance;
    }
}

export const orderRepositoryServiceIns = new OrderRepositoryService(orderRepositoryIns);
