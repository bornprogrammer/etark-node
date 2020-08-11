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