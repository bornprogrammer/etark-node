
import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { ServiceCenterActivity } from "./ServiceCenterActivity";
import { ServiceCenterOrder } from "./ServiceCenterOrder";
import { DeviceDispatchDetails } from "./DeviceDispatchDetails";
import { UserAddress } from "./UserAddress";
import { ServiceCenters } from "./ServiceCenters";

export interface PickupDeliveryAttirbutes {
    id?: number;
    user_plan_id: number;
    service_center_id: number;
    delivery_amount: number;
    distance_meters: number;
    user_address_id?: number;
    status?: string;
}

export class PickupDelivery extends Model implements PickupDeliveryAttirbutes {
    id: number;
    user_plan_id: number;
    service_center_id: number;
    delivery_amount: number;
    distance_meters: number;
    user_address_id?: number;
    public readonly serviceCenterActivity?: ServiceCenterActivity[];
    public readonly serviceCenterOrder?: ServiceCenterOrder[];
    public readonly deviceDispatchDetails?: DeviceDispatchDetails;
    public readonly userAddress?: UserAddress[];
    public readonly serviceCenter?: ServiceCenters;
    public static readonly serviceCenterActivityAs: string = "serviceCenterActivity";
    public static readonly serviceCenterOrderAs: string = "serviceCenterOrder";
    public static readonly deviceDispatchDetailsAs: string = "deviceDispatchDetails";
    public static readonly userAddressAs?: string = "userAddress";
    public static readonly serviceCenterAs?: string = "serviceCenter";
}

PickupDelivery.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    user_plan_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    service_center_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    delivery_amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    distance_meters: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    user_address_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'success', 'service_denied')
    }
}, {
    tableName: "pickup_deliveries",
    underscored: true,
    sequelize: sequelizeConnection.connection
})

PickupDelivery.hasMany(ServiceCenterActivity, { as: PickupDelivery.serviceCenterActivityAs, foreignKey: "pickup_delivery_id" });

ServiceCenterActivity.belongsTo(PickupDelivery, { foreignKey: "pickup_delivery_id" });

PickupDelivery.hasMany(ServiceCenterOrder, { as: PickupDelivery.serviceCenterOrderAs, foreignKey: "pickup_delivery_id" });

ServiceCenterOrder.belongsTo(PickupDelivery, { foreignKey: "pickup_delivery_id" });

PickupDelivery.hasOne(DeviceDispatchDetails, { as: PickupDelivery.deviceDispatchDetailsAs, foreignKey: "pick_delivery_id" });

DeviceDispatchDetails.belongsTo(PickupDelivery, { foreignKey: "pick_delivery_id" });