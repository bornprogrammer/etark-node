import { Sequelize } from "sequelize";

export class SequelizeConnection {

    public connection: Sequelize;

    constructor() {
        this.connection = new Sequelize(
            "etark",
            "root",
            "Divyani_1990",
            // "YCombi2020",
            {
                host: "localhost",
                // host: "etark.c7yr7myjbwov.ap-south-1.rds.amazonaws.com",
                dialect: "mysql",
            },
        );
    }

    public async connect() {
        try {
            await this.connection.authenticate();
        } catch (error) {
            console.log(error);
        }
    }
}

export const sequelizeConnection = new SequelizeConnection();