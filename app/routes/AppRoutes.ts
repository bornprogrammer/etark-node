import CartRoutes from '@app/modules/cart/CartRoutes';
import { CashfreeRoutes } from '@app/modules/cashfree/CashfreeRoutes';
import EventRoutes from '@app/modules/events/EventRoutes';
import { FBConversationsRoutes } from '@app/modules/fb_conversations/FBConversationsRoutes';
import HubLevelRoutes from '@app/modules/hub-level/HubLevelRoutes';
import { NotificationsRoutes } from '@app/modules/notifications/NotificationsRoutes';
import OrderRoutes from '@app/modules/order/OrderRoutes';
import QuestRoutes from '@app/modules/quest/QuestRoutes';
import TrackUserRoutes from '@app/modules/user-track/TrackUserRoutes';
import CartRoutesV1 from '@app/modules/V1cart/CartRoutesV1';
import express from 'express';
export default class AppRoutes {

    public static routes() {
        const router = express.Router();
        // router.use('/custom-menu', CustomMenusRoutes.setRoutes(router));
        // router.use('/custom-menu-post', CustomMenuPostRoutes.setRoutes(router));
        // router.use('/buddy', BuddyRoutes.setRoutes(router));
        router.use('/hub-level', HubLevelRoutes.setRoutes(router));
        router.use('/v1/cart', CartRoutesV1.setRoutes());
        router.use('/cart', CartRoutes.setRoutes());
        router.use('/events', EventRoutes.setRoutes(router));
        router.use('/track-user', TrackUserRoutes.setRoutes(router));
        router.use('/order', OrderRoutes.setRoutes());
        router.use('/topics', FBConversationsRoutes.setRoutes());
        router.use('/fb-conversations', FBConversationsRoutes.setRoutesForFBConversations());
        router.use('/questions', FBConversationsRoutes.setRoutesForAnswers());
        router.use('/answers', FBConversationsRoutes.setRoutesForComments());
        router.use('/quests', QuestRoutes.setRoutes());
        router.use('/cashfree', CashfreeRoutes.setRoutes());
        router.use('/notifications', NotificationsRoutes.setRoutes());
        return router;
    }
}
