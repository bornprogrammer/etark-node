
import { Model, Optional, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { UserStatusEnum } from "@app/enums/UserStatusEnum";
import { Complaint } from "./Complaint";

interface UserAttributes {
    id: number;
    name: string;
    mobile_number: string;
    password: string;
    status: string;
    email: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "status"> {

}

// export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
export class User extends Model {
    id: number;
    name: string;
    mobile_number: string;
    password: string;
    created_at: string;
    status: string;
    email: string;
}

User.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    name:
    {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    mobile_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        // field: "mobile_number"
    },
    password: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(16),
        defaultValue: UserStatusEnum.ACTIVE
    }
},
    {
        tableName: "users",
        sequelize: sequelizeConnection.connection,
        timestamps: true,
        updatedAt: false,
        underscored: true,
    }
);

User.hasMany(Complaint, { as: "complaints", foreignKey: "user_id" });

Complaint.belongsTo(User, { as: "user", foreignKey: "user_id" });