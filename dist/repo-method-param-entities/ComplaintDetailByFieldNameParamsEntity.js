"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintDetailByFieldNameParamsEntity = void 0;
const GetComplaintDetailsParamsEntity_1 = require("./GetComplaintDetailsParamsEntity");
class ComplaintDetailByFieldNameParamsEntity extends GetComplaintDetailsParamsEntity_1.GetComplaintDetailsParamsEntity {
    /**
     *
     */
    constructor(complaintId, fieldName) {
        super(complaintId);
        this.fieldName = fieldName;
    }
}
exports.ComplaintDetailByFieldNameParamsEntity = ComplaintDetailByFieldNameParamsEntity;
//# sourceMappingURL=ComplaintDetailByFieldNameParamsEntity.js.map