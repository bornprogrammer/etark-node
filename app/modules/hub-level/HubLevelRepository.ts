import { TokenNotSentError } from '@app/errors/TokenNotSentError';
import { repositoryMethodHandlerIns } from '@app/method-handler/RepositoryMethodHandler';
import BaseRepository from '@app/repositories/BaseRepository';
import { HubLevelModel, hubLevelModelIns } from './HubLevelModel';

export class HubLevelRepository extends BaseRepository {

    private hubLevelModel: HubLevelModel;

    constructor(hubLevelModel: HubLevelModel) {
        super();
        this.hubLevelModel = hubLevelModel;
    }

    public getUserAddedHubs = async (obj: any) => {
        try {
            const data = await this.hubLevelModel.getUserAddedHubs({ ...obj, page: obj.page ? obj.page : '1' });
            return data;
        } catch (error) {
            throw new Error();
        }
    }

    public getUserRecentlyAddedHubs = async (obj: any) => {
        try {
            const data = await this.hubLevelModel.getUserRecentlyAddedHubs({ ...obj, page: obj.page ? obj.page : '1' });
            return data;
        } catch (error) {
            throw new Error();
        }
    }

    public getAdminAddedHubs = async (obj: any) => {
        return await repositoryMethodHandlerIns.setParams({ userId: obj.userId, page: obj.page ? obj.page : '1' }).setMethodHandler(this.hubLevelModel.getAdminAddedHubs).get();
        /*try {
            const data = await this.hubLevelModel.getAdminAddedHubs(obj.userId, obj.page?obj.page:'1');
            return data;
        } catch (error) {
            throw new Error();
        }*/
    }

    public getUserPrimaryHubs = async (userId: string) => {
        return await repositoryMethodHandlerIns.setParams(userId)
            .setMethodHandler(this.hubLevelModel.getUserPrimaryHubs).get();
    }

    public getUserAddedHubsCount = async (obj: any) => {
        return await repositoryMethodHandlerIns.setParams(obj)
            .setMethodHandler(this.hubLevelModel.getUserAddedHubsCount).get();
    }

    public getAdminAddedHubsCount = async (obj: any) => {
        return await repositoryMethodHandlerIns.setParams(obj)
            .setMethodHandler(this.hubLevelModel.getAdminAddedHubsCount).get();
    }

    public getHubMetadata = async (userId: string) => {
        return await repositoryMethodHandlerIns.setParams({ userId })
            .setMethodHandler(this.hubLevelModel.getHubMetadata).get();
        // try {
        //     const data = await this.hubLevelModel.getHubSlotChallenges(userId);
        //     return data;
        // } catch (error) {
        //     throw new Error();
        // }
    }

    public getHubSlotChallenges = async (userId: string) => {
        return await repositoryMethodHandlerIns.setParams(userId)
            .setMethodHandler(this.hubLevelModel.getHubSlotChallenges).get();
        // try {
        //     const data = await this.hubLevelModel.getHubSlotChallenges(userId);
        //     return data;
        // } catch (error) {
        //     throw new Error();
        // }
    }

    public getUserPrivateKitchenHubs = async (obj: any) => {
        return await repositoryMethodHandlerIns
            .setParams({ userId: obj.userId, page: obj.page ? obj.page : '1' })
            .setMethodHandler(this.hubLevelModel.getUserPrivateKitchenHubs).get();
        // try {
        //     const data = await this.hubLevelModel.getUserPrivateKitchenHubs(obj.userId, obj.page?obj.page:'1');
        //     return data;
        // } catch (error) {
        //     throw new Error();
        // }
    }

    public getSlotInfo = async (userId: string) => {
        return await repositoryMethodHandlerIns
            .setParams(userId)
            .setMethodHandler(this.hubLevelModel.getSlotInfo).get();
        // try {
        //     return await this.hubLevelModel.getSlotInfo(userId);
        // } catch (error) {
        //     throw new Error();
        // }
    }

    public searchHubs = async (obj) => {
        return await repositoryMethodHandlerIns
            .setParams(obj)
            .setMethodHandler(this.hubLevelModel.searchHubs).get();
        // try {
        //     return await this.hubLevelModel.searchHubs(obj);
        // } catch (error) {
        //     throw new Error();
        // }
    }

    public searchHubsCount = async (obj) => {
        return await repositoryMethodHandlerIns
            .setParams(obj)
            .setMethodHandler(this.hubLevelModel.searchHubsCount).get();
        // try {
        //     return await this.hubLevelModel.searchHubs(obj);
        // } catch (error) {
        //     throw new Error();
        // }
    }

    public isHubAddedByUser = async (obj) => {
        return await repositoryMethodHandlerIns
            .setParams(obj)
            .setMethodHandler(this.hubLevelModel.isHubAddedByUser).get();
        // try {
        //     return await this.hubLevelModel.isHubAddedByUser(obj);
        // } catch (error) {
        //     throw new Error();
        // }
    }

    public deleteHub = async (obj) => {
        return await repositoryMethodHandlerIns
            .setParams(obj)
            .setMethodHandler(this.hubLevelModel.deleteHub).get();
        // try {
        //     return await this.hubLevelModel.deleteHub(obj);
        // } catch (error) {
        //     throw new Error();
        // }
    }

    public getSlotStatus = async (userId: string) => {
        return await repositoryMethodHandlerIns
            .setParams(userId)
            .setMethodHandler(this.hubLevelModel.getSlotStatus).get();
        // try {
        //     return await this.hubLevelModel.getSlotStatus(userId);
        // } catch (error) {
        //     throw new Error();
        // }
    }

    public getHubPrice = async (hub_id: string) => {
        return await repositoryMethodHandlerIns
            .setParams(hub_id)
            .setMethodHandler(this.hubLevelModel.getHubPrice).get();
        // try {
        //     return await this.hubLevelModel.getHubPrice(hub_id);
        // } catch (error) {
        //     throw new Error();
        // }
    }

    public getSlotPrice = async () => {
        return await repositoryMethodHandlerIns
            .setMethodHandler(this.hubLevelModel.getSlotPrice).get();
        // try {
        //     const result = await this.hubLevelModel.getSlotPrice();
        //     return result;
        // } catch (error) {
        //     throw new Error();
        // }
    }

    public updateSlotCount = async (obj) => {
        return await repositoryMethodHandlerIns
            .setParams(obj)
            .setMethodHandler(this.hubLevelModel.updateSlotCount).get();
        // try {
        //     return await this.hubLevelModel.updateSlotCount(obj);
        // } catch (error) {
        //     throw new Error();
        // }
    }

    // tslint:disable-next-line: variable-name
    public getBuddyCredit = async (user_id: string) => {
        return await repositoryMethodHandlerIns
            .setParams(user_id)
            .setMethodHandler(this.hubLevelModel.getBuddyCredit).get();
        // try {
        //     const result = await this.hubLevelModel.getBuddyCredit(user_id);
        //     return result;
        // } catch (error) {
        //     throw new Error();
        // }
    }

    public addSlot = async (user_id: string) => {
        return await repositoryMethodHandlerIns
            .setParams(user_id)
            .setMethodHandler(this.hubLevelModel.addSlot).get();
        // try {
        //     const result = await this.hubLevelModel.addSlot(user_id);
        //     return result;
        // } catch (error) {
        //     throw new Error();
        // }
    }

    public addBuddyWallet = async (data: any) => {
        return await repositoryMethodHandlerIns
            .setParams(data)
            .setMethodHandler(this.hubLevelModel.addBuddyWallet).get();
        // try {
        //     const result = await this.hubLevelModel.addBuddyWallet(data);
        //     return result;
        // } catch (error) {
        //     throw new Error();
        // }
    }

    // add Secondary Hub Process
    public checkUserSlotAvailability = async (userId: string) => {
        return await repositoryMethodHandlerIns
            .setParams(userId)
            .setMethodHandler(this.hubLevelModel.checkUserSlotAvailability).get();
        // try {
        //     const result = await this.hubLevelModel.checkUserSlotAvailability(userId);
        //     return result;
        // } catch (error) {
        //     throw new Error();
        // }
    }

    public checkSecondaryHub = async (data: any) => {
        return await repositoryMethodHandlerIns
            .setParams(data)
            .setMethodHandler(this.hubLevelModel.checkSecondaryHub).get();
        // try {
        //     const result = await this.hubLevelModel.checkSecondaryHub(data.user_id, data.hub_id);
        //     return result;
        // } catch (error) {
        //     throw new Error();
        // }
    }

    public addSecondaryHub = async (data: any) => {
        return await repositoryMethodHandlerIns
            .setParams(data)
            .setMethodHandler(this.hubLevelModel.addSecondaryHub).get();
        // try {
        //     const result = await this.hubLevelModel.addSecondaryHub(data.user_id, data.hub_id);
        //     return result;
        // } catch (error) {
        //     throw new Error();
        // }
    }

    public softDeleteManageApartmentRequestRecords = async (data: any) => {
        return await repositoryMethodHandlerIns
            .setParams(data)
            .setMethodHandler(this.hubLevelModel.softDeleteManageApartmentRequestRecords).get();
        // try {
        //     const result = await this.hubLevelModel.softDeleteManageApartmentRequestRecords(data.userId, data.hub_id);
        //     return result;
        // } catch (error) {
        //     throw new Error();
        // }
    }

    public addManageApartmentRequest = async (data: any) => {
        return await repositoryMethodHandlerIns
            .setParams(data)
            .setMethodHandler(this.hubLevelModel.addManageApartmentRequest).get();
        // try {
        //     const result = await this.hubLevelModel.addManageApartmentRequest(data.userId, data.hub_id);
        //     return result;
        // } catch (error) {
        //     throw new Error();
        // }
    }

    public addSecondaryHubTransaction = async (user_hub_id: string) => {
        return await repositoryMethodHandlerIns
            .setParams(user_hub_id)
            .setMethodHandler(this.hubLevelModel.addSecondaryHubTransaction).get();
        // try {
        //     const result = await this.hubLevelModel.addSecondaryHubTransaction(user_hub_id);
        //     return result;
        // } catch (error) {
        //     throw new Error();
        // }
    }

    public filterSearchHubs = async (data: any) => {
        return await repositoryMethodHandlerIns
            .setParams(data)
            .setMethodHandler(this.hubLevelModel.filterSearchHubs).get();
    }
}

export const hubLevelRepositoryIns = new HubLevelRepository(hubLevelModelIns);
