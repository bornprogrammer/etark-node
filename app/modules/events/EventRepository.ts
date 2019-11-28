import { TokenNotSentError } from '@app/errors/TokenNotSentError';
import { repositoryMethodHandlerIns } from '@app/method-handler/RepositoryMethodHandler';
import BaseRepository from '@app/repositories/BaseRepository';
import { EventModel, eventModelIns } from './EventModel';
import {transformCategoryGoodies, TransformCategoryGoodies} from './TransformCategoryGoodies';

export class EventRepository extends BaseRepository {

    private eventModel: EventModel;

    constructor(eventModel: EventModel) {
        super();
        this.eventModel = eventModel;
    }

    public getCookingClassById = async (obj) => {
        return await repositoryMethodHandlerIns.setParams(obj)
            .setMethodHandler(this.eventModel.getCookingClassById).get();
    }

    public getCuratedProductsById = async (obj) => {
        return await repositoryMethodHandlerIns.setParams(obj)
            .setMethodHandler(this.eventModel.getCuratedProductsById).get();
    }

    public getCarouselEvents = async (obj) => {
        return await repositoryMethodHandlerIns
            .setParams(obj)
            .setMethodHandler(this.eventModel.getCarouselEvents).get();
    }

    public getCookingClassList = async (obj) => {
        return await repositoryMethodHandlerIns
            .setParams(obj)
            .setMethodHandler(this.eventModel.getCookingClassList).get();
    }

    public getCuratedProductList = async (obj) => {
        return await repositoryMethodHandlerIns
            .setParams(obj)
            .setMethodHandler(this.eventModel.getCuratedProductList).get();
    }

    public getCookingClassPastOrders = async (obj) => {
        return await repositoryMethodHandlerIns
            .setParams(obj)
            .setMethodHandler(this.eventModel.getCookingClassPastOrders).get();
    }

    public getCuratedProductPastOrders = async (obj) => {
        return await repositoryMethodHandlerIns
            .setParams(obj)
            .setMethodHandler(this.eventModel.getCuratedProductPastOrders).get();
    }

    public getCookingClassUpcomingOrders = async (obj) => {
        return await repositoryMethodHandlerIns
            .setParams(obj)
            .setMethodHandler(this.eventModel.getCookingClassUpcomingOrders).get();
    }

    public getCuratedProductUpcomingOrders = async (obj) => {
        return await repositoryMethodHandlerIns
            .setParams(obj)
            .setMethodHandler(this.eventModel.getCuratedProductUpcomingOrders).get();
    }

    public getCookingClassBanner = async (obj) => {
        return await repositoryMethodHandlerIns
            .setParams(obj)
            .setMethodHandler(this.eventModel.getCookingClassBanner).get();
    }

    public getCuratedBanner = async (obj) => {
        return await repositoryMethodHandlerIns
            .setParams(obj)
            .setMethodHandler(this.eventModel.getCuratedBanner).get();
    }

    public getDishTionaryBanner = async () => {
        const result = await repositoryMethodHandlerIns
        .setMethodHandler(this.eventModel.getDishTionaryBanner).get();
        if (result.length > 0 && result[0].reward_amount) {
            result[0].reward_amount = result[0].reward_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return result;
    }

    public getBookedEventsCount = async (obj) => {
        return await repositoryMethodHandlerIns
            .setParams(obj)
            .setMethodHandler(this.eventModel.getBookedEventsCount).get();
    }

    public goodiesAllCategories = async (obj) => {
        return await repositoryMethodHandlerIns
            .setParams(obj)
            .setMethodHandler(this.eventModel.goodiesAllCategories).get();
    }

    public getCategoryList = async (obj) => {
        return await repositoryMethodHandlerIns
            .setParams(obj)
            .setMethodHandler(this.eventModel.getCategoryList).get();
    }

    public getActiveQuest = async (obj) => {
        return await repositoryMethodHandlerIns
            .setParams(obj)
            .setMethodHandler(this.eventModel.getActiveQuest).get();
    }
}

export const eventRepositoryIns = new EventRepository(eventModelIns);
