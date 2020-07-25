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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelizeConnection = exports.SequelizeConnection = void 0;
const sequelize_1 = require("sequelize");
class SequelizeConnection {
    constructor() {
        this.connection = new sequelize_1.Sequelize("etark", "root", "Divyani_1990", {
            host: "localhost",
            dialect: "mysql",
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection.authenticate();
                console.log('connected');
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