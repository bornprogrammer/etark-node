// import CartRoutesV1 from '@app/modules/V1cart/CartRoutesV1';
import express from 'express';
import { AuthRoutes } from './auth/AuthRoutes';
export default class AppRoutes {
    public static routes() {
        const router = express.Router();

        router.use("/auth", AuthRoutes.setRoutes(router));

        // router.use('/hub-level', HubLevelRoutes.setRoutes(router));
        // router.use('/v1/cart', CartRoutesV1.setRoutes());
        // router.use('/cart', CartRoutes.setRoutes());
        // router.use('/events', EventRoutes.setRoutes(router));
        // router.use('/track-user', TrackUserRoutes.setRoutes(router));
        // router.use('/order', OrderRoutes.setRoutes());
        // router.use('/topics', FBConversationsRoutes.setRoutes());
        // router.use('/fb-conversations', FBConversationsRoutes.setRoutesForFBConversations());
        // router.use('/questions', FBConversationsRoutes.setRoutesForAnswers());
        // router.use('/answers', FBConversationsRoutes.setRoutesForComments());
        // router.use('/quests', QuestRoutes.setRoutes());
        // router.use('/cashfree', CashfreeRoutes.setRoutes());
        // router.use('/notifications', NotificationsRoutes.setRoutes());
        return router;
    }
}
