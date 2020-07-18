import { cfServiceIns } from '@app/cashfree/CFService';
import { PlatformTypeEnum } from '@app/enums/PlatformTypeEnum';
import { IAfterOrderPlacedEntity } from './IAfterOrderPlacedEntity';
import { ICashFreeEntity } from './ICashFreeEntity';

export class AfterOrderPlaced {

    constructor() {
    }

    public async onAfterOrderPlaced(aAfterOrderPlacedEntityParams: IAfterOrderPlacedEntity) {
        let result = null;
        if (aAfterOrderPlacedEntityParams.isPaymentModeOnline) {
            result = await this.processCashfree(aAfterOrderPlacedEntityParams.orderParams, aAfterOrderPlacedEntityParams.platformType);
            return result;
        }
    }

    private processCashfree = async (params: ICashFreeEntity, platformType: string) => {
        let processedCashfreeData = null;
        switch (platformType) {
            case PlatformTypeEnum.PLATFORM_IOS:
                processedCashfreeData = await this.generateCFTokenForIOS(params);
                return processedCashfreeData;
            case PlatformTypeEnum.PLATFORM_WEB:
                processedCashfreeData = await this.generateCFPaymentLinkForWeb(params);
                return processedCashfreeData;
        }
    }

    private generateCFTokenForIOS = async (iCashFreeEntityParams: ICashFreeEntity) => {
        const token = await cfServiceIns.generateCFToken(iCashFreeEntityParams);
        return { cftoken: token };
    }

    private generateCFPaymentLinkForWeb = async (iCashFreeEntityParams: ICashFreeEntity) => {
        const paymentLink = await cfServiceIns.generateCFPaymentLink(iCashFreeEntityParams);
        return { payment_link: paymentLink };
    }

}

export const afterOrderPlacedIns = new AfterOrderPlaced();
