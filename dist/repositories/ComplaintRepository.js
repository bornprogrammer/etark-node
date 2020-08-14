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
const BaseRepository_1 = __importDefault(require("@app/repositories/BaseRepository"));
const Complaint_1 = require("@app/models/Complaint");
const ComplaintDetails_1 = require("@app/models/ComplaintDetails");
const Field_1 = require("@app/models/Field");
const MakerDetails_1 = require("@app/models/MakerDetails");
const ObjectHelper_1 = require("@app/helpers/ObjectHelper");
const User_1 = require("@app/models/User");
const Maker_1 = require("@app/models/Maker");
class ComplaintRepository extends BaseRepository_1.default {
    /**
     *
     */
    constructor() {
        super();
        this.getComplaintDetails = (params) => __awaiter(this, void 0, void 0, function* () {
            let result = yield Complaint_1.Complaint.findOne({
                where: {
                    id: params.complaintId,
                    status: params.complaintStatus
                },
                include: [
                    {
                        required: true,
                        model: MakerDetails_1.MakerDetails,
                        as: "makerDetail",
                    },
                    {
                        model: ComplaintDetails_1.ComplaintDetails,
                        as: "complainDetails",
                        include: [
                            {
                                model: Field_1.Field,
                                required: true,
                                as: "field",
                            }
                        ],
                        required: true
                    }
                ]
            });
            // let result = await Complaint.scope(['defaultScope', 'resolvedComplains', 'complainDetails', { method: ['byComplainId', params.complaintId] }]).findOne();
            // , 'resolvedComplains', 'makerDetail', 'complainDetails', { method: ['byComplainId', params.complaintId] }
            return result;
        });
        this.getComplaintDetailByFieldName = (params) => __awaiter(this, void 0, void 0, function* () {
            let result = yield this.getComplaintDetails(params);
            let complainDetail = null;
            if (ObjectHelper_1.ObjectHelper.isObjectNotEmpty(result)) {
                result.complainDetails.forEach((complainDetailObj) => {
                    if (complainDetailObj.field.field_name === params.fieldName) {
                        complainDetail = complainDetailObj;
                    }
                });
            }
            return complainDetail;
        });
        this.getSuccessPageDetails = (orderId, userId) => __awaiter(this, void 0, void 0, function* () {
            let result = yield Complaint_1.Complaint.scope(['defaultScope', 'complainDetails', { method: ['getPlan', orderId] }]).findOne({
                // include: [
                //     {
                //         model: UserPlan,
                //         required: true,
                //         as: "userPlan",
                //         where: {
                //             status: ['pending', 'success']
                //         },
                //         include: [
                //             {
                //                 model: UserPayment,
                //                 required: true,
                //                 as: "userPayments",
                //                 where: {
                //                     id: orderId,
                //                     payment_status: "completed"
                //                 }
                //             },
                //             {
                //                 model: Plan,
                //                 required: true,
                //                 as: "plan"
                //             }
                //         ]
                //     },
                // {
                //     model: ComplaintDetails,
                //     required: true,
                //     as: "complainDetails",
                //     include: [
                //         {
                //             model: Field,
                //             as: "field",
                //             // required: true
                //         }
                //     ]
                // }
                // ],
                where: {
                    user_id: userId
                },
            });
            return result;
        });
        this.getComplainDetailsForServiceCenterEmail = (orderId) => __awaiter(this, void 0, void 0, function* () {
            // let orderId = 146;
            let result = yield Complaint_1.Complaint.scope(['defaultScope', 'complainDetails', { method: ['getPlan', orderId] }]).findOne({
                include: [
                    {
                        model: User_1.User,
                        required: true,
                        as: "user",
                        attributes: [
                            'name'
                        ]
                    },
                    {
                        model: MakerDetails_1.MakerDetails,
                        required: true,
                        as: "makerDetail",
                        attributes: [
                            'display_name'
                        ],
                        include: [
                            {
                                model: Maker_1.Maker,
                                required: true,
                                as: "maker",
                                attributes: [
                                    'maker_name'
                                ]
                            }
                        ]
                    }
                ]
            });
            return result;
        });
        this.getInspectionFeeComponent = (params) => __awaiter(this, void 0, void 0, function* () {
            let result = yield Complaint_1.Complaint.findOne({
                include: [
                    {
                        model: MakerDetails_1.MakerDetails,
                        required: true,
                        as: "makerDetail",
                        attributes: [
                            'inspection_charges'
                        ],
                    }
                ],
                where: {
                    id: params.complainId,
                }
            });
            return result;
        });
    }
    create(params) {
    }
}
exports.ComplaintRepository = ComplaintRepository;
exports.complaintRepositoryIns = new ComplaintRepository();
//# sourceMappingURL=ComplaintRepository.js.map