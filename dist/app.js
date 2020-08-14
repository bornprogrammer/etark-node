"use strict";
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
const path_1 = __importDefault(require("path"));
const AppRoutes_1 = __importDefault(require("./routes/AppRoutes"));
const SequelizeConnection_1 = require("./SequelizeConnection");
class App {
    constructor() {
        console.log(process.env.NODE_ENV);
        this.app = express_1.default();
        this.app.use(require('cors')());
        const port = process.env.PORT || 5000;
        this.app.listen(port, () => {
            console.log(`node app started at ${port}`);
        });
        this.dbSetup();
        this.configApp();
        this.app.get('/ts/health-check', (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send('status is healthy 1.1');
        }));
        this.app.use(express_1.default.static(path_1.default.join(__dirname, "./public")));
        this.app.use('/api', AppRoutes_1.default.routes());
    }
    dbSetup() {
        SequelizeConnection_1.sequelizeConnection.connect();
    }
    configApp() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
}
exports.default = App;
new App();
//# sourceMappingURL=app.js.map