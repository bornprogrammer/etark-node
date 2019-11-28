import * as dotenv from 'dotenv';

dotenv.config();
import App from '@app/app';
import Logger from '@app/services/Logger';

const app = new App().app;

app.listen(process.env.LISTEN_PORT, () => {
    Logger.info('Express server listening on port ' + process.env.LISTEN_PORT);
});
