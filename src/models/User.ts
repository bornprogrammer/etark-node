
import { Model, Optional, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { UserStatusEnum } from "@app/enums/UserStatusEnum";

interface UserAttributes {
    id: number;
    name: string;
    mobileNumber: string;
    password: string;
    status: string;
    email: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "status"> {

}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {

    id: number;
    name: string;
    mobileNumber: string;
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
    mobileNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: "mobile_number"
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
        createdAt: "created_at",
        updatedAt: false

    }
);