"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const Sequelize = __importStar(require("sequelize"));
const database = process.env.DB_DATABASE;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
exports.sequelize = new Sequelize.Sequelize(
// database,
// username,
// password,
// {
//     host,
//     dialect: process.env.DB_DIALECT,
//     operatorsAliases: false,
//     logging: logSetting,
//     pool: {
//         // tslint:disable-next-line: radix
//         // max: parseInt(process.env.DB_MAX_CON_POOL),
//         // tslint:disable-next-line: radix
//         // min: parseInt(process.env.DB_MIN_CON_POOL),
//         // tslint:disable-next-line: radix
//         // idle: parseInt(process.env.DB_IDLE_CON),
//     },
// },
);
//# sourceMappingURL=sequelize.js.map