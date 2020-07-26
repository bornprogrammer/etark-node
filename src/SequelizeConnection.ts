import { Sequelize } from "sequelize";


export class SequelizeConnection {

    public connection: Sequelize;

    constructor() {

        this.connection = new Sequelize(
            "etark",
            "root",
            "Divyani_1990",
            {
                host: "localhost",
                dialect: "mysql",
            },
        );
    }

    public async connect() {
        try {
            await this.connection.authenticate();
            console.log('connected');
        } catch (error) {
            console.log(error);
        }
    }
}

export const sequelizeConnection = new SequelizeConnection();