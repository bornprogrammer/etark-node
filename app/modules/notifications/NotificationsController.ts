import BaseController from '@app/controllers/BaseController';
import { PnsEventsName } from '@app/enums/PnsEventsName';
import { ctrlMethodHandlerIns } from '@app/method-handler/CtrlMethodHandler';
import { fcmNotificationFacadeIns } from '@app/notifications/FcmNotificationFacade';
import { fcmPushNotificationPayloadBuilderIns } from '@app/notifications/FcmPushNotificationPayloadBuilder';
import { responseServiceIns } from '@app/response-handler/ResponseService';
import { Request, Response } from 'express';
import { FBConversationsEntityEnum } from '../fb_conversations/FBConversationsEntityEnum';
import { questionRepositoryServiceIns } from '../fb_conversations/questions/QuestionRepositoryService';
import { notificationsControllerParamsBuilderIns } from './NotificationsControllerParamsBuilder';
import { NotificationsRepositoryService, notificationsRepositoryServiceIns } from './NotificationsRepositoryService';

export class NotificationsController extends BaseController {

    constructor(notificationsRepositoryService: NotificationsRepositoryService) {
        super(notificationsRepositoryService);
    }

    public send = async (req: Request, res: Response) => {
        const body = req.body;
        const userIds = body.user_ids;
        const notificationData = body.payload;
        fcmNotificationFacadeIns.sendByUserIdsNPayload(userIds, notificationData);
        responseServiceIns.sendResponse(req, res, { status: 'done' });
    }

    public sendSms = async (req: Request, res: Response) => {
        // questionRepositoryServiceIns.getMostResponsedQuestion();
        // responseServiceIns.sendResponse(req, res, { status: 'done' });
    }

    public testPns = async (req: Request, res: Response) => {
        const payload = fcmPushNotificationPayloadBuilderIns().setPNSName(PnsEventsName.PNS_TO_TOPIC_BOOKMARKED_USERS_ON_QUESTION_ASKED).setPayloadVal('topic_id', '1').setBodyTemplateValue({ user_name: 'sandeep' });
        fcmNotificationFacadeIns.sendByPnsEventNameWithExcludeLoggedInUserId({ entity_origin_id: 1, entity_type: FBConversationsEntityEnum.TOPIC, pns_event_name: PnsEventsName.PNS_TO_TOPIC_BOOKMARKED_USERS_ON_QUESTION_ASKED }, payload, 44338);
        responseServiceIns.sendResponse(req, res, { status: 'done' });
    }

    public testPns1 = async (req: Request, res: Response) => {
        const payload = fcmPushNotificationPayloadBuilderIns().setPNSName(PnsEventsName.PNS_TO_TOPIC_BOOKMARKED_USERS_ON_QUESTION_ASKED).setPayloadVal('topic_id', '1').setBodyTemplateValue({ user_name: 'sandeep' });
        fcmNotificationFacadeIns.sendByPnsEventNameWithExcludeLoggedInUserId({ entity_origin_id: 1, entity_type: FBConversationsEntityEnum.TOPIC, pns_event_name: PnsEventsName.PNS_TO_TOPIC_BOOKMARKED_USERS_ON_QUESTION_ASKED }, payload, 44338);
        responseServiceIns.sendResponse(req, res, { status: 'done' });
    }

    public testPns2 = async (req: Request, res: Response) => {
        const payload = fcmPushNotificationPayloadBuilderIns().setPNSName(PnsEventsName.PNS_TO_TOPIC_BOOKMARKED_USERS_ON_QUESTION_ASKED).setPayloadVal('topic_id', '1').setBodyTemplateValue({ user_name: 'sandeep' });
        fcmNotificationFacadeIns.sendByPnsEventNameWithExcludeLoggedInUserId({ entity_origin_id: 1, entity_type: FBConversationsEntityEnum.TOPIC, pns_event_name: PnsEventsName.PNS_TO_TOPIC_BOOKMARKED_USERS_ON_QUESTION_ASKED }, payload, 44338);
        responseServiceIns.sendResponse(req, res, { status: 'done' });
    }

    public subscribe = async (req: Request, res: Response) => {
        const params = notificationsControllerParamsBuilderIns(req).setPnsEventNameFromBody().setUserId().setEntityOriginIdFromBody().setEntityType(req.body.entity_type).build();
        ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.subscribe).setParams(params).call(req, res);
    }

    public unSubscribe = async (req: Request, res: Response) => {
        const params = notificationsControllerParamsBuilderIns(req).setPnsEventNameFromUrl().setUserId().setEntityOriginIdFromUrl().setEntityType(req.params.entityType).build();
        ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.unSubscribe).setParams(params).call(req, res);
    }
}

export const notificationsControllerIns = new NotificationsController(notificationsRepositoryServiceIns);
