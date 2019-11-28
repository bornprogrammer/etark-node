import Logger from '@app/services/Logger';
export class UserRoutes {

    public routes(app: any): void {
        Logger.info('Connected to DB');
    }

}
