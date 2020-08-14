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
exports.planRepositoryIns = exports.PlanRepository = void 0;
const BaseRepository_1 = __importDefault(require("@app/repositories/BaseRepository"));
const Plan_1 = require("@app/models/Plan");
const PlanComponents_1 = require("@app/models/PlanComponents");
class PlanRepository extends BaseRepository_1.default {
    /**
     *
     */
    constructor() {
        super();
        this.getPlanComponentDetails = (params) => __awaiter(this, void 0, void 0, function* () {
            // let params = methodParamEntity.topMethodParam;
            let result = yield Plan_1.Plan.findOne({
                where: {
                    id: params.planId,
                },
                include: {
                    model: PlanComponents_1.PlanComponent,
                    where: {
                        status: params.planComponentStatus
                    },
                    required: true
                }
            });
            return result;
        });
        this.create = (params) => __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
}
exports.PlanRepository = PlanRepository;
exports.planRepositoryIns = new PlanRepository();
//# sourceMappingURL=PlanRepository.js.map