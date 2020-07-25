// import * as dotenv from 'dotenv';

// import { sequelize } from '@app/config/Sequelize';
// import { Routes } from '@app/routes/Routes';
// import Logger from '@app/services/Logger';
// import Ajv from 'ajv';
import express, { Request, Response } from 'express';
// import CommonConstants from './constants/CommonConstants';
// import MiddlewareBootstrapper from './middleware-bootstrapper/MiddlewareBootstrapper';
import AppRoutes from './routes/AppRoutes';
// import { getEnv } from 'google-auth-library/build/src/auth/envDetect';

export default class App {

    private app: express.Application;
    // public routes: Routes = new Routes();
    constructor() {

        this.app = express();

        let port = process.env.PORT || 5000;
        this.app.listen(port, () => {
            console.log(`node app started at ${port}`);
        });
        // this.app.use(cors({ origin: true, credentials: true }));
        this.dbSetup();
        this.configApp();
        // tslint:disable-next-line: no-commented-out-code
        // MiddlewareBootstrapper.bootstrap(this.app);
        this.app.get('/ts/health-check', async (req: Request, res: Response) => {
            res.send('status is healthy 17.21');
        });
        // this.app.use('/ts', MiddlewareBootstrapper.bootstrap());
        this.app.use('/api', AppRoutes.routes());
        // this.errorHandler();
    }

    private dbSetup(): void {
        // Logger.info('Connecting to DB');
        // sequelize
        //     .authenticate()
        //     .then(() => {
        //         Logger.info('Connected to DB');
        //     })
        //     .catch((err) => {
        //         Logger.error('Unable to connect to DB', err);
        //     });
    }

    private configApp(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    private errorHandler(): void {
        this.app.use((err, req, res, next) => {
            if (err) {

                // Logger.error(err.stack);

                let message = '';
                // if (process.env.NODE_ENV !== CommonConstants.ENVIRONMENTS.PROD) {
                //     message = err.message;
                // }

                res.status(500).send({
                    success: false,
                    message,
                });
            }
        });
    }

}

new App();