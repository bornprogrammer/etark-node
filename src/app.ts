
import express, { Request, Response } from 'express';

import AppRoutes from './routes/AppRoutes';

import { sequelizeConnection } from './SequelizeConnection';

export default class App {

    private app: express.Application;

    constructor() {

        this.app = express();

        const port = process.env.PORT || 5000;

        this.app.listen(port, () => {
            console.log(`node app started at ${port}`);
        });

        this.dbSetup();
        this.configApp();

        this.app.get('/ts/health-check', async (req: Request, res: Response) => {
            res.send('status is healthy 1.1');
        });
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

new App();