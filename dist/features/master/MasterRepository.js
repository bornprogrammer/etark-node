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
exports.masterRepositoryIns = exports.MasterRepository = void 0;
const MakerDetails_1 = require("@app/models/MakerDetails");
const Maker_1 = require("@app/models/Maker");
const Merchant_1 = require("@app/models/Merchant");
const sequelize_1 = require("sequelize");
const Plan_1 = require("@app/models/Plan");
const City_1 = require("@app/models/City");
const BaseRepository_1 = __importDefault(require("@app/repositories/BaseRepository"));
class MasterRepository extends BaseRepository_1.default {
    /**
     *
     */
    constructor() {
        super();
        this.getMakerListByCategoryId = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let result = yield Maker_1.Maker.findAll({
                include: {
                    model: MakerDetails_1.MakerDetails,
                    where: {
                        category_id: params.id
                    },
                    required: true
                },
            });
            return result;
        });
        this.getMerchantList = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let result = yield Merchant_1.Merchant.findAll({
                where: {
                    [sequelize_1.Op.or]: [
                        {
                            merchant_type: params.type
                        },
                        {
                            merchant_type: "both"
                        }
                    ]
                }
            });
            return result;
        });
        this.getPlans = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let result = yield Plan_1.Plan.findAll();
            return result;
        });
        this.getCities = () => __awaiter(this, void 0, void 0, function* () {
            let result = yield City_1.City.findAll({
                where: {
                    status: 'active'
                }
            });
            return result;
        });
    }
    create(params) {
        throw new Error("Method not implemented.");
    }
}
exports.MasterRepository = MasterRepository;
exports.masterRepositoryIns = new MasterRepository();
//# sourceMappingURL=MasterRepository.js.map