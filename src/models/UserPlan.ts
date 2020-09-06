import { Model, DataTypes, Association } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { UserPlanComponent } from "./UserPlanComponent";
import { UserPayment } from "./UserPayment";
import { Plan } from "./Plan";
import { PickupDelivery } from "./PickupDelivery";


export interface UserPlanAttributes {
    id: number;
    complain_id?: number;
    plan_id?: number;
    status?: string;
}

export interface UserPlanCreationAttributes extends Model<UserPlanAttributes>, UserPlanAttributes {
}

// export class UserPlan extends Model<UserPlanAttributes, UserPlanCreationAttributes>{
export class UserPlan extends Model {
    id: number;
    complain_id: number;
    plan_id: number;
    status: string;
    public readonly UserPlanComponents?: UserPlanComponent[];
    public readonly userPayments?: UserPayment[];
    public readonly plan?: Plan;
    public static readonly userPaymentsAs: string = "userPayments";
    public readonly pickupDeliveryDetail?: PickupDelivery;
    public static readonly pickupDeliveryDetailAs: string = "pickupDeliveryDetail"
    public static readonly userPlanComponentAs?: string = "userPlanComponentAs";
    public static readonly planAs?: string = "plan";
}

UserPlan.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    complain_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    plan_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: "pending"
    }
}, {
    sequelize: sequelizeConnection.connection,
    tableName: "user_plan",
    underscored: true
}
)

UserPlan.hasMany(UserPlanComponent, { as: UserPlan.userPlanComponentAs, foreignKey: "user_plan_id" });

UserPlanComponent.belongsTo(UserPlan, { foreignKey: "user_plan_id" });

UserPlan.hasMany(UserPayment, {
    as: UserPlan.userPaymentsAs
});

UserPayment.belongsTo(UserPlan);

UserPlan.hasOne(PickupDelivery, { as: UserPlan.pickupDeliveryDetailAs, foreignKey: "user_plan_id" });

PickupDelivery.belongsTo(UserPlan, { foreignKey: "user_plan_id" })
