// import * as dotenv from 'dotenv';

import { sequelize } from '@app/config/Sequelize';
import { Routes } from '@app/routes/Routes';
import Logger from '@app/services/Logger';
import Ajv from 'ajv';
import * as bodyParser from 'body-parser';
import express from 'express';
import CommonConstants from './constants/CommonConstants';
import MiddlewareBootstrapper from './middleware-bootstrapper/MiddlewareBootstrapper';
import AppRoutes from './routes/AppRoutes';
import WebappRoutes from './routes/WebappRoutes';
import { getEnv } from 'google-auth-library/build/src/auth/envDetect';
const cron = require('./cron-scheduler');
var cors = require('cors');
// import { cronObj } from './cron-scheduler';

export const appAJV = new Ajv({ allErrors: true });
export default class App {
    public app: express.Application;
    // public routes: Routes = new Routes();

    constructor() {
        this.app = express();
        this.app.use(cors({ origin: true, credentials: true }));
        this.dbSetup();
        this.config();
        // tslint:disable-next-line: no-commented-out-code
        // MiddlewareBootstrapper.bootstrap(this.app);
        this.app.get('/ts/health-check', async (req, res) => {
            res.send('status is healthy 17.21');
        });
        this.app.use('/ts/webapp', WebappRoutes.routes());
        this.app.use('/ts', MiddlewareBootstrapper.bootstrap());
        this.app.use('/ts', AppRoutes.routes());
        this.errorHandler();
    }

    private dbSetup(): void {
        Logger.info('Connecting to DB');
        sequelize
            .authenticate()
            .then(() => {
                Logger.info('Connected to DB');
            })
            .catch((err) => {
                Logger.error('Unable to connect to DB', err);
            });
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    private errorHandler(): void {
        this.app.use((err, req, res, next) => {
            if (err) {

                Logger.error(err.stack);

                let message = '';
                if (process.env.NODE_ENV !== CommonConstants.ENVIRONMENTS.PROD) {
                    message = err.message;
                }

                res.status(500).send({
                    success: false,
                    message,
                });
            }
        });
    }

}
