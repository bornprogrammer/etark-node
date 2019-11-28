import { TokenNotSentError } from '@app/errors/TokenNotSentError';
import BaseRepository from '@app/repositories/BaseRepository';
import { HubModel, hubModelIns } from './hubModel';

export class HubRepository extends BaseRepository {

    private hubModel: HubModel;

    constructor(hubModel: HubModel) {
        super();
        this.hubModel = hubModel;
    }

    public checkUserSlotAvailability = async (data: any) => {
        try {
            const result = await hubModelIns.checkUserSlotAvailability(data);
            return result;
        } catch (error) {
            throw new TokenNotSentError();
        }
    }

    public checkSecondaryHub = async (data: any) => {
        try {
            const result = await hubModelIns.checkSecondaryHub(data);
            return result;
        } catch (error) {
            throw new TokenNotSentError();
        }
    }

    public addSecondaryHub = async (data: any) => {
        try {
            const result = await hubModelIns.addSecondaryHub(data);
            return result[0];
        } catch (error) {
            throw new TokenNotSentError();
        }
    }

    public softDeleteManageApartmentRequestRecords = async (data: any) => {
        try {
            const result = await hubModelIns.softDeleteManageApartmentRequestRecords(data);
            return result[0];
        } catch (error) {
            throw new TokenNotSentError();
        }
    }

    public addManageApartmentRequest = async (data: any) => {
        try {
            const result = await hubModelIns.addManageApartmentRequest(data);
            return result[0];
        } catch (error) {
            throw new TokenNotSentError();
        }
    }

    public addSecondaryHubTransaction = async (data: any) => {
        try {
            const result = await hubModelIns.addSecondaryHubTransaction(data);
            return result[0];
        } catch (error) {
            throw new TokenNotSentError();
        }
    }

    public updateSlotCount = async (data: any) => {
        try {
            const result = await hubModelIns.updateSlotCount(data);
            return result[0];
        } catch (error) {
            throw new TokenNotSentError();
        }
    }

}

export const hubRepositoryIns = new HubRepository(hubModelIns);
