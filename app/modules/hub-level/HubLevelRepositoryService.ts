import CustomError from '@app/errors/CustomError';
import ExpectationFailedError from '@app/errors/ExpectationFailedError';
import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import AppMiddlewareBootstrapper from '@app/middleware-bootstrapper/AppMiddlewareBootstrapper';
import BaseRepositoryService from '@app/services/BaseRepositoryService';
import { HubLevelRepository, hubLevelRepositoryIns } from './HubLevelRepository';

export class HubLevelRepositoryService extends BaseRepositoryService {

    constructor(hubLevelRepository: HubLevelRepository) {
        super(hubLevelRepository);
    }

    public getUserAddedHubs = async (obj: Object) => {
        try {
            const [data, count] = await Promise.all([
                repositoryServiceMethodHandlerIns
                    .setMethodHandler(this.mRepository.getUserAddedHubs).setParams(obj).get(),
                repositoryServiceMethodHandlerIns
                    .setMethodHandler(this.mRepository.getUserAddedHubsCount).setParams(obj).get(),
            ]);
            console.log(count);
            return data.length > 0 ? { data, total_pages: Math.ceil((count.total_count / 20)) } : data;
        } catch (error) {
            throw new Error();
        }
    }

    public getAdminAddedHubs = async (obj: Object) => {
        try {
            const [data, count] = await Promise.all([
                repositoryServiceMethodHandlerIns
                    .setMethodHandler(this.mRepository.getAdminAddedHubs).setParams(obj).get(),
                repositoryServiceMethodHandlerIns
                    .setMethodHandler(this.mRepository.getAdminAddedHubsCount).setParams(obj).get(),
            ]);
            console.log(count);
            return data.length > 0 ? { data, total_pages: Math.ceil((count.total_count / 20)) } : data;
        } catch (error) {
            throw new Error();
        }
    }

    public getPrivateKitchenHubs = async (obj: Object) => {
        return await repositoryServiceMethodHandlerIns
            .setMethodHandler(this.mRepository.getUserPrivateKitchenHubs).setParams(obj).get();
    }

    public searchHubs = async (obj) => {
        return await repositoryServiceMethodHandlerIns
            .setMethodHandler(this.mRepository.searchHubs).setParams(obj).get();
    }

    public searchHubsV1 = async (obj) => {
        const [count, hubs] = await Promise.all([
            repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.searchHubsCount).setParams(obj).get(),
            repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.searchHubs).setParams(obj).get(),
        ]);
        return hubs.length > 0 ? { count: count.total_hubs, hubs } : [];
    }

    public buySlot = async (data: any) => {
        // tslint:disable-next-line: variable-name
        const slot_availability = await this.checkAvailability(data.user_id);
        if (!slot_availability.is_available) {
            throw new ExpectationFailedError('Not enough buddy credit');
        }
        const addSlotResult = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.addSlot)
            .setParams(data.user_id).get();
        const addBuddyWalletResult = await repositoryServiceMethodHandlerIns.
            setMethodHandler(this.mRepository.addBuddyWallet)
            .setParams({ user_id: data.user_id, amount: slot_availability.amount, id: addSlotResult, origin: 'hub_slot' }).get();
        const res = await this.updateSlotCount(data.user_id);
        return res;
        // tslint:disable-next-line: no-commented-out-code
        // return await repositoryServiceMethodHandlerIns
        // .setMethodHandler(this.mRepository.buySlot).setParams(data.user_id).get();
    }

    public deleteHub = async (obj) => {
        try {
            const deletedHub = await repositoryServiceMethodHandlerIns
                .setMethodHandler(this.mRepository.deleteHub).setParams(obj).get();
            return await this.updateSlotCount(obj.userId);
        } catch (err) {
            console.log(err);
            throw Error(err);
        }
    }

    public updateSlotCount = async (userId: string) => {
        try {
            const slotDetails = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getSlotStatus)
                .setParams(userId).get();
            if (slotDetails && slotDetails.length > 0) {
                const data = { userId, ...slotDetails[0] };
                return await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.updateSlotCount)
                    .setParams(data).get();
            } else {
                throw Error('usdas');
            }
        } catch (err) {
            throw Error(err);
        }
    }

    public isHubAddedByUser = async (obj) => {
        const isUserAddedHub = await repositoryServiceMethodHandlerIns
            .setMethodHandler(this.mRepository.isHubAddedByUser).setParams(obj).get();
        if (isUserAddedHub && isUserAddedHub.length > 0) {
            return isUserAddedHub;
        } else {
            throw new Error();
        }
    }

    public hubHome = async (userId: string) => {
        try {
            const [secondary_hub_added_by_buddy,
                secondary_hub_added_by_admin,
                primary_hubs,
                slot_challenges,
                private_kitchen,
                slot_info,
                slot_price,
                hubMetaData,
            ] = await Promise.all([
                repositoryServiceMethodHandlerIns
                    .setMethodHandler(this.mRepository.getUserRecentlyAddedHubs).setParams({ userId }).get(),
                repositoryServiceMethodHandlerIns
                    .setMethodHandler(this.mRepository.getAdminAddedHubs).setParams({ userId }).get(),
                repositoryServiceMethodHandlerIns
                    .setMethodHandler(this.mRepository.getUserPrimaryHubs).setParams(userId).get(),
                repositoryServiceMethodHandlerIns
                    .setMethodHandler(this.mRepository.getHubSlotChallenges).setParams(userId).get(),
                repositoryServiceMethodHandlerIns
                    .setMethodHandler(this.mRepository.getUserPrivateKitchenHubs).setParams({ userId }).get(),
                repositoryServiceMethodHandlerIns
                    .setMethodHandler(this.mRepository.getSlotInfo).setParams(userId).get(),
                repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getSlotPrice).get(),
                repositoryServiceMethodHandlerIns.
                    setMethodHandler(this.mRepository.getHubMetadata).setParams(userId).get(),
            ]);
            return {
                ...slot_info && slot_info.length > 0 ? slot_info[0] : { total_slots: 0, vacant_slots: 0 },
                ...hubMetaData,
                slot_price: slot_price.price,
                secondary_hub_added_by_buddy,
                secondary_hub_added_by_admin,
                primary_hubs,
                slot_challenges,
                private_kitchen,
            };
        } catch (error) {
            throw new Error();
        }
    }

    public buySecondaryHub = async (data: any) => {
        let secondary_hub_id = '';
        const userSlotAvailability = await repositoryServiceMethodHandlerIns
            .setMethodHandler(this.mRepository.checkUserSlotAvailability)
            .setParams(data.user_id).get();
        if (userSlotAvailability.length > 0 && userSlotAvailability[0].is_available === 1) {
            const checkSecondaryHub = await repositoryServiceMethodHandlerIns
                .setMethodHandler(this.mRepository.checkSecondaryHub)
                .setParams({ user_id: data.user_id, hub_id: data.hub_id }).get();
            if (checkSecondaryHub.length > 0) {
                throw new ExpectationFailedError('Hub is already added');
            }
            const hubPrice = await repositoryServiceMethodHandlerIns
                .setMethodHandler(this.mRepository.getHubPrice)
                .setParams(data.hub_id).get();

            const buddyCredit = await repositoryServiceMethodHandlerIns.
                setMethodHandler(this.mRepository.getBuddyCredit)
                .setParams(data.user_id).get();
            if (hubPrice.price > buddyCredit.buddy_credits) {
                throw new ExpectationFailedError(`Don't have enough buddy credit`);
            }

            const addSecondaryHubResult = await repositoryServiceMethodHandlerIns
                .setMethodHandler(this.mRepository.addSecondaryHub)
                .setParams({ user_id: data.user_id, hub_id: data.hub_id }).get();
            secondary_hub_id = addSecondaryHubResult;
            await repositoryServiceMethodHandlerIns
                .setMethodHandler(this.mRepository.softDeleteManageApartmentRequestRecords)
                .setParams({ userId: data.user_id, hub_id: data.hub_id }).get();
            const addMARresult = await repositoryServiceMethodHandlerIns
                .setMethodHandler(this.mRepository.addManageApartmentRequest)
                .setParams({ userId: data.user_id, hub_id: data.hub_id }).get();
            const addSecondaryHubTransaction = await repositoryServiceMethodHandlerIns
                .setMethodHandler(this.mRepository.addSecondaryHubTransaction)
                .setParams(secondary_hub_id).get();

            if (hubPrice.price !== 0) {
                const addBuddyWalletResult = await repositoryServiceMethodHandlerIns.
                    setMethodHandler(this.mRepository.addBuddyWallet)
                    .setParams({ user_id: data.user_id, amount: hubPrice.price, id: addSecondaryHubTransaction, origin: 'secondary_hub_transaction' }).get();
            }
            return await this.updateSlotCount(data.user_id);
        } else {
            throw new ExpectationFailedError('Slot not available');
        }
    }

    // tslint:disable-next-line: variable-name
    public checkAvailability = async (user_id: string) => {
        const slotPrice = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getSlotPrice)
            .get();
        const buddyCredit = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getBuddyCredit)
            .setParams(user_id).get();
        return slotPrice.price > buddyCredit.buddy_credits
            ? { is_available: false }
            : { is_available: true, amount: slotPrice.price };
    }

    public filterSearchHubs = async (data: any) => {
        return await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.filterSearchHubs)
            .setParams(data).get();
    }
}

export const hubLevelRepositoryServiceIns = new HubLevelRepositoryService(hubLevelRepositoryIns);
