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
exports.complaintRepositoryIns = exports.ComplaintRepository = void 0;
const Complaint_1 = require("@app/models/Complaint");
const ComplaintDetails_1 = require("@app/models/ComplaintDetails");
const BaseRepository_1 = __importDefault(require("@app/repositories/BaseRepository"));
class ComplaintRepository extends BaseRepository_1.default {
    /**
     *
     */
    constructor() {
        super();
        this.addComplaints = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let complaintParams = { user_id: params.user_id, maker_detail_id: params.maker_detail_id };
            let result = yield Complaint_1.Complaint.create(complaintParams);
            return result;
        });
        this.addComplaintDetails = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let lastInvokedMethodParam = methodParamEntity.lastInvokedMethodParam;
            let params = methodParamEntity.topMethodParam;
            for (const complaintDetailsObj of params.complaints_details) {
                yield ComplaintDetails_1.ComplaintDetails.create({ complaint_id: lastInvokedMethodParam.id, field_id: complaintDetailsObj.field_id, field_val: complaintDetailsObj.field_val });
            }
            return lastInvokedMethodParam;
        });
        this.addDeviceImages = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            // let lastInvokedMethodParam = methodParamEntity.topMethodParam;
            let params = methodParamEntity.topMethodParam;
            let result = null;
            for (const complaintDetailsObj of params.complaints_details) {
                result = yield ComplaintDetails_1.ComplaintDetails.create({ complaint_id: params.complaint_id, field_id: complaintDetailsObj.field_id, field_val: complaintDetailsObj.field_val });
            }
            return result;
        });
    }
    create(params) {
        throw new Error("Method not implemented.");
    }
}
exports.ComplaintRepository = ComplaintRepository;
exports.complaintRepositoryIns = new ComplaintRepository();
//# sourceMappingURL=ComplaintRepository.js.map