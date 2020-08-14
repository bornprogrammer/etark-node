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
exports.sequelizeConnection = exports.SequelizeConnection = void 0;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("config"));
class SequelizeConnection {
    constructor() {
        this.connection = new sequelize_1.Sequelize(config_1.default.get("db.dbname"), config_1.default.get("db.username"), config_1.default.get("db.password"), {
            host: config_1.default.get("db.host"),
            dialect: config_1.default.get("dialect"),
        });
    }
    // http://maps.googleapis.com/maps/AIzaSyDUfEmM-rNKTLvklGuTeHDKthxs0gaKCBo/distancematrix/json?origins=54.406505, 18.67708&destinations=54.446251, 18.570993&mode=driving&language=en-EN&sensor=false
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection.authenticate();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.SequelizeConnection = SequelizeConnection;
exports.sequelizeConnection = new SequelizeConnection();
//# sourceMappingURL=SequelizeConnection.js.map