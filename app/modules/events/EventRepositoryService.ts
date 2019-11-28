import CustomError from '@app/errors/CustomError';
import ExpectationFailedError from '@app/errors/ExpectationFailedError';
import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import AppMiddlewareBootstrapper from '@app/middleware-bootstrapper/AppMiddlewareBootstrapper';
import BaseRepositoryService from '@app/services/BaseRepositoryService';
import { EventRepository, eventRepositoryIns } from './EventRepository';

export class EventRepositoryService extends BaseRepositoryService {

    constructor(eventRepository: EventRepository) {
        super(eventRepository);
    }

    public getCookingClassById = async (obj: Object) => {
        const data = await repositoryServiceMethodHandlerIns
            .setMethodHandler(this.mRepository.getCookingClassById).setParams(obj).get();
        return Object.keys(data).length > 0 ? this.structureEventData(data) : {};

    }

    public getCuratedProductsById = async (obj: Object) => {
        const data = await repositoryServiceMethodHandlerIns
            .setMethodHandler(this.mRepository.getCuratedProductsById).setParams(obj).get();
        return Object.keys(data).length > 0 ? this.structureEventData(data) : {};
    }

    public getCarouselEvents = async (obj: Object) => {
        try {
            const data = await Promise.all([
                repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getCookingClassBanner).setParams(obj).get(),
                repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getCuratedBanner).setParams(obj).get(),
            ]);
            return [...data[0], ...data[1]];
        } catch (err) {
            throw new Error();
        }
    }

    public getCarouselEventsV1 = async (obj: Object) => {
        try {
            const [classes, goodies, quest, dish_tionary] = await Promise.all([
                repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getCookingClassBanner).setParams(obj).get(),
                repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getCuratedBanner).setParams(obj).get(),
                repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getActiveQuest).setParams(obj).get(),
                repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getDishTionaryBanner).get(),
            ]);
            console.log('FOODY QUEST: ', quest, quest[0].foody_quest_ids);
            return {
                quest: (quest.length > 0 && quest[0].foody_quest_ids) ? {
                    "banner_id": -1,
                    "title": "Earn Credits. Pay Less!",
                    "description": "Complete Simple tasks & Win Credits",
                    "banner_image": "https://foodybuddyrik.s3-ap-southeast-1.amazonaws.com/uploads/event/challenge.png",
                    "cover_image": "https://foodybuddyrik.s3-ap-southeast-1.amazonaws.com/uploads/event/coverChallenge.png",
                    "item_lookup_id": 2,
                    "type": "challenges",
                    "name": `Win Rs ${quest[0].reward_amount}`,
                    "color_code": "#BF751823",
                    "total_events": 0
                } : null,
                cooking_class: classes.length > 0 ? classes[0] : null,
                goodies: goodies.length > 0 ? goodies[0] : null,
                dish_tionary: dish_tionary.length > 0 ? dish_tionary[0] : null,
            }
        } catch (err) {
            throw new Error();
        }
    }

    public getCookingClassList = async (obj: Object) => {
        return await repositoryServiceMethodHandlerIns
            .setMethodHandler(this.mRepository.getCookingClassList).setParams(obj).get();
    }

    public getCuratedProductList = async (obj: Object) => {
        return await repositoryServiceMethodHandlerIns
            .setMethodHandler(this.mRepository.getCuratedProductList).setParams(obj).get();
    }

    public goodiesAllCategories = async (obj: Object) => {
        try {
            let [goodies, category] = await Promise.all([
                repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.goodiesAllCategories).setParams(obj).get(),
                repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getCategoryList).setParams(obj).get()
            ])
            return goodies.length == 0 ? [] : {
                category: [{ name: 'All', category_id: 0 }, ...category],
                all_goodies: goodies
            }
        } catch (err) {
            throw new Error();
        }
    }

    public getBookedEventsCount = async (obj: Object) => {
        return await repositoryServiceMethodHandlerIns
            .setMethodHandler(this.mRepository.getBookedEventsCount).setParams(obj).get();
    }

    public getCookingClassHistory = async (obj: Object) => {
        try {
            const [upcoming, past] = await Promise.all([
                repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getCookingClassUpcomingOrders).setParams(obj).get(),
                repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getCookingClassPastOrders).setParams(obj).get(),
            ]);
            return upcoming && upcoming.length > 0 || past && past.length > 0 ? { upcoming, past } : {};
        } catch (err) {
            throw new Error();
        }
    }

    public getCuratedProductHistory = async (obj: Object) => {
        try {
            const [upcoming, past] = await Promise.all([
                repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getCuratedProductUpcomingOrders).setParams(obj).get(),
                repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getCuratedProductPastOrders).setParams(obj).get(),
            ]);
            return upcoming && upcoming.length > 0 || past && past.length > 0 ? { upcoming, past } : {};
        } catch (err) {
            throw new Error();
        }
    }

    public structureEventData(obj) {
        obj.event_details.forEach((e) => {
            if (obj.hasOwnProperty(e.type.toLowerCase())) {
                obj[e.type.toLowerCase()].push(e);
            } else {
                obj[e.type.toLowerCase()] = [e];
            }
        });
        delete obj.event_details;
        return obj;
    }
}

export const eventRepositoryServiceIns = new EventRepositoryService(eventRepositoryIns);
