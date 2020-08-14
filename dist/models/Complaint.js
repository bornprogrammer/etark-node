"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Complaint = void 0;
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
const ComplaintDetails_1 = require("./ComplaintDetails");
const Field_1 = require("./Field");
const UserPlan_1 = require("./UserPlan");
const UserPayment_1 = require("./UserPayment");
const Plan_1 = require("./Plan");
// export class Complaint extends Model<ComplaintAttributes, ComplaintCreationAttributes> implements ComplaintAttributes {
class Complaint extends sequelize_1.Model {
}
exports.Complaint = Complaint;
Complaint.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    maker_detail_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'resolved', 'unresolved'),
        defaultValue: "pending"
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    sequelize: SequelizeConnection_1.sequelizeConnection.connection,
    underscored: true,
    tableName: "complaints",
    defaultScope: {
        where: {
            status: ["pending", "resolved"]
        }
    },
    scopes: {
        resolvedComplains: {
            where: {
                status: "resolved"
            }
        },
        pendingComplains: {
            where: {
                status: "pending"
            }
        },
        complainDetails: {
            include: [
                {
                    model: ComplaintDetails_1.ComplaintDetails,
                    as: "complainDetails",
                    attributes: [
                        'field_val'
                    ],
                    include: [
                        {
                            model: Field_1.Field,
                            // required: true,
                            as: "field",
                            attributes: [
                                'id',
                                'field_name'
                            ]
                        }
                    ],
                    required: true
                },
            ]
        },
        getPlan(orderId) {
            return {
                include: [
                    {
                        model: UserPlan_1.UserPlan,
                        required: true,
                        as: "userPlan",
                        where: {
                            status: ['pending', 'success']
                        },
                        include: [
                            {
                                model: UserPayment_1.UserPayment,
                                required: true,
                                as: "userPayments",
                                where: {
                                    id: orderId,
                                    payment_status: "completed"
                                }
                            },
                            {
                                model: Plan_1.Plan,
                                required: true,
                                as: "plan"
                            }
                        ]
                    },
                ],
            };
        },
        // complaintUser: {
        //     include: [
        //         {
        //             model: User,
        //             // required: true,
        //             // as: "user"
        //         }
        //     ]
        // },
        byComplainId(complainId) {
            return {
                where: {
                    id: complainId,
                }
            };
        }
    }
});
Complaint.hasMany(ComplaintDetails_1.ComplaintDetails, { as: "complainDetails" });
ComplaintDetails_1.ComplaintDetails.belongsTo(Complaint);
Complaint.hasOne(UserPlan_1.UserPlan, { as: "userPlan", foreignKey: "complain_id" });
UserPlan_1.UserPlan.belongsTo(Complaint, { as: "complaint", foreignKey: "complain_id" });
//# sourceMappingURL=Complaint.js.map