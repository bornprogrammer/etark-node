import ErrorFactory from '@app/errors/ErrorFactory';
import ObjectHelper from '@app/modules/helper/ObjectHelper';
import PrivateKitchenRepositoryService, { privateKitchenRepositoryService } from '@app/modules/private-kitchen/PrivateKitchenRepositoryService';
import BaseRepositoryService from '@app/services/BaseRepositoryService';
import CustomMenuPostRepository, { customMenuPostRepository } from './CustomMenuPostRepository';

export default class CustomMenuPostRepositoryService extends BaseRepositoryService {

    constructor(customMenuPostRepository: CustomMenuPostRepository) {
        super(customMenuPostRepository);
    }

    public postCustomMenu = async (postCustomMenuObj: object) => {
        let result: any;
        try {
            result =  await this.mRepository.create(postCustomMenuObj);
            return result;
        } catch (error) {
                throw new ErrorFactory(error);
        }
    }

    public validateAdvancePayment = async (obj: any) => {
        const isCashOnly = false;
        if ((obj.pkId !== '') && (obj.advancePayment !== '')) {
           try {
            const isCashOnly = await privateKitchenRepositoryService.isCashOnly(obj.pkId);
            if (!isCashOnly) {
                // TODO implement the adv payment error exception
                throw new Error('Advance payment cant be accepted for cash only kitchen');
            }
           } catch (error) {
               throw new ErrorFactory(error);
           }
        }
    // check whether he has an advance payment enabled, if yes then check whether the seller has enabled online payment
        return isCashOnly;
    }

    public addDeliveryDetails = async () => {

    }

    public editDeliveryDetails = async () => {

    }

    public postInHubs = async (obj: any) => {

    }

    public postForUsers = async (obj: any) => {

    }

}

export const customMenuPostRepositoryService = new CustomMenuPostRepositoryService(customMenuPostRepository);
