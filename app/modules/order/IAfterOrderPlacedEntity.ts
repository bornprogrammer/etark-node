import { ICashFreeEntity } from './ICashFreeEntity';

export interface IAfterOrderPlacedEntity {
    orderParams: ICashFreeEntity;
    platformType?: string;
    isPaymentModeOnline?: boolean;
}
