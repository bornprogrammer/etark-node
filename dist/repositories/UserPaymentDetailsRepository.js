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
exports.userPaymentDetailsRepositoryIns = exports.UserPaymentDetailsRepository = void 0;
const BaseRepository_1 = __importDefault(require("@app/repositories/BaseRepository"));
const UserPaymentDetails_1 = require("@app/models/UserPaymentDetails");
class UserPaymentDetailsRepository extends BaseRepository_1.default {
    constructor() {
        super(...arguments);
        this.create = (params) => __awaiter(this, void 0, void 0, function* () {
            let result = yield UserPaymentDetails_1.UserPaymentDetails.create({
                user_payment_id: params.id,
                gateway_response: params.gateway_response
            });
            return result;
        });
    }
}
exports.UserPaymentDetailsRepository = UserPaymentDetailsRepository;
exports.userPaymentDetailsRepositoryIns = new UserPaymentDetailsRepository();
//# sourceMappingURL=UserPaymentDetailsRepository.js.map