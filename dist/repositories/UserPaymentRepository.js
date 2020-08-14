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
exports.userPaymentRepositoryIns = void 0;
const BaseRepository_1 = __importDefault(require("@app/repositories/BaseRepository"));
const UserPayment_1 = require("@app/models/UserPayment");
class UserPaymentRepository extends BaseRepository_1.default {
    /**
     *
     */
    constructor() {
        super();
        this.create = (userPayment) => __awaiter(this, void 0, void 0, function* () {
            let result = yield UserPayment_1.UserPayment.create(userPayment);
            return result;
        });
        this.update = (userPayment) => __awaiter(this, void 0, void 0, function* () {
            let result = yield userPayment.save();
            return result;
        });
        this.updateUserPaymentStatus = (params) => __awaiter(this, void 0, void 0, function* () {
            let result = yield UserPayment_1.UserPayment.update({
                payment_status: params.paymentStatus
            }, {
                where: {
                    id: params.orderId,
                    payment_status: 'pending'
                }
            });
            return result;
        });
    }
}
exports.userPaymentRepositoryIns = new UserPaymentRepository();
//# sourceMappingURL=UserPaymentRepository.js.map