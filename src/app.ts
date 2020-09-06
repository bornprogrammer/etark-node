import express, { Request, Response } from 'express';

import path from 'path';

import AppRoutes from './routes/AppRoutes';

import { sequelizeConnection } from './SequelizeConnection';

import { Server } from 'http';

import config from 'config';
class App {

    private app: express.Application;

    public server: Server;

    constructor() {

        console.log(process.env.NODE_ENV);

        this.app = express();

        this.app.use(require('cors')());

        // const port = process.env.PORT || 5000;

        const port = config.get("port");

        this.server = this.app.listen(port, () => {
            console.log(`node app started at ${port}`);
        });

        this.dbSetup();
        this.configApp();

        this.app.get('/ts/health-check', async (req: Request, res: Response) => {
            res.send('status is healthy 1.1');
        });

        this.app.use(express.static(path.join(__dirname, "./public")));

        this.app.use('/api', AppRoutes.routes());
    }

    private dbSetup(): void {
        sequelizeConnection.connect();
    }

    private configApp(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }
}

export const appInstance = new App();