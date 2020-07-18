import DIContainer from '@app/DIContainer';

export class Routes {

    public routes(app: any): void {

        const authMiddleware = DIContainer.authMiddleware;

        // app.get('/ts/v1/buddies/:buddyUserId/accounts',
        //         authMiddleware.required,
        //         DIContainer.v1BuddiesController.getAccount);

        // app.get('/ts/v1/buddies/:buddyUserId/orders',
        //         authMiddleware.required,
        //         DIContainer.v1BuddiesController.getOrders);

        app.post('/ts/cashfree/webhook', DIContainer.cashfreeController.webhook);

        app.get('/ts/api/status', (req, res) => {
            res.send({});
        });
    }
}
