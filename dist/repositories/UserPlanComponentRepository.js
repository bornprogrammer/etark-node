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
exports.userPlanComponentRepositoryIns = exports.UserPlanComponentRepository = void 0;
const BaseRepository_1 = __importDefault(require("@app/repositories/BaseRepository"));
const UserPlanComponent_1 = require("@app/models/UserPlanComponent");
class UserPlanComponentRepository extends BaseRepository_1.default {
    constructor() {
        super(...arguments);
        this.create = (params) => __awaiter(this, void 0, void 0, function* () {
            for (const planComponentObj of params.planComponent) {
                yield UserPlanComponent_1.UserPlanComponent.create({
                    user_plan_id: params.userPlanId,
                    plan_components_id: planComponentObj.id,
                    component_price: planComponentObj.component_price
                });
            }
            return true;
        });
        this.update = (params) => __awaiter(this, void 0, void 0, function* () {
            let update = UserPlanComponent_1.UserPlanComponent.update({
                component_price: params.componentPrice
            }, {
                where: {
                    id: params.userPlanComponentId
                }
            });
            return update;
        });
    }
}
exports.UserPlanComponentRepository = UserPlanComponentRepository;
exports.userPlanComponentRepositoryIns = new UserPlanComponentRepository();
//# sourceMappingURL=UserPlanComponentRepository.js.map