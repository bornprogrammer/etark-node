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
exports.complaintDetailsRepositoryIns = exports.ComplaintDetailsRepository = void 0;
const BaseRepository_1 = __importDefault(require("@app/repositories/BaseRepository"));
const ComplaintDetails_1 = require("@app/models/ComplaintDetails");
class ComplaintDetailsRepository extends BaseRepository_1.default {
    constructor() {
        super(...arguments);
        this.create = (complaintDetails) => __awaiter(this, void 0, void 0, function* () {
            let resultArr = [];
            for (const complainDetailObj of complaintDetails) {
                let result = yield complainDetailObj.save();
                resultArr.push(result);
            }
            return resultArr;
        });
        this.update = (complainDetailObj) => __awaiter(this, void 0, void 0, function* () {
            let result = yield ComplaintDetails_1.ComplaintDetails.update({
                field_val: complainDetailObj.field_val
            }, {
                where: {
                    id: complainDetailObj.complain_detail_id
                }
            });
            return result;
        });
        // public updateByFieldId = async (complainDetailObj: UpdateComplainDetailByFieldIdParamsEntity) => {
        //     let result = await ComplaintDetails.update({
        //         field_val: complainDetailObj.fieldVal
        //     }, {
        //         where: {
        //             complaint_id: complainDetailObj.complainId,
        //             field_id: complainDetailObj.field_id
        //         }
        //     });
        //     return result;
        // }
    }
}
exports.ComplaintDetailsRepository = ComplaintDetailsRepository;
exports.complaintDetailsRepositoryIns = new ComplaintDetailsRepository();
//# sourceMappingURL=ComplaintDetailsRepository.js.map