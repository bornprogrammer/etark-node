import { Sequelize } from "sequelize";

export class SequelizeConnection {
    public connection: Sequelize;
    constructor() {
        this.connection = new Sequelize(
            "etark",
            "root",
            // "Divyani_1990",
            "YCombi2020",
            {
                // host: "localhost",
                host: "etark.c7yr7myjbwov.ap-south-1.rds.amazonaws.com",
                dialect: "mysql",
            },
        );
    }

    // http://maps.googleapis.com/maps/AIzaSyDUfEmM-rNKTLvklGuTeHDKthxs0gaKCBo/distancematrix/json?origins=54.406505, 18.67708&destinations=54.446251, 18.570993&mode=driving&language=en-EN&sensor=false

    public async connect() {
        try {
            await this.connection.authenticate();
        } catch (error) {
            console.log(error);
        }
    }
}

export const sequelizeConnection = new SequelizeConnection();