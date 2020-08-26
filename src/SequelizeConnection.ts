import { Sequelize } from "sequelize";
import config from "config";

export class SequelizeConnection {
    public connection: Sequelize;
    constructor() {
        this.connection = new Sequelize(
            config.get("db.dbname"),
            config.get("db.username"),
            config.get("db.password"),
            {
                host: config.get("db.host"),
                dialect: config.get("dialect"),
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