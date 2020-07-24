"use strict";
// import * as dotenv from 'dotenv';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import CommonConstants from './constants/CommonConstants';
// import MiddlewareBootstrapper from './middleware-bootstrapper/MiddlewareBootstrapper';
// import AppRoutes from './routes/AppRoutes';
// import WebappRoutes from './routes/WebappRoutes';
// import { getEnv } from 'google-auth-library/build/src/auth/envDetect';
class App {
    // public routes: Routes = new Routes();
    constructor() {
        this.app = express_1.default();
        this.app.listen(5000, () => {
            console.log('sss');
        });
        // this.app.use(cors({ origin: true, credentials: true }));
        this.dbSetup();
        this.config();
        // tslint:disable-next-line: no-commented-out-code
        // MiddlewareBootstrapper.bootstrap(this.app);
        this.app.get('/ts/health-check', (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send('status is healthy 17.21');
        }));
        // this.app.use('/ts/webapp', WebappRoutes.routes());
        // this.app.use('/ts', MiddlewareBootstrapper.bootstrap());
        // this.app.use('/ts', AppRoutes.routes());
        this.errorHandler();
    }
    dbSetup() {
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
    config() {
        // this.app.use(bodyParser.json());
        // this.app.use(bodyParser.urlencoded({ extended: true }));
    }
    errorHandler() {
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
exports.default = App;
new App();
//# sourceMappingURL=app.js.map