require("dotenv").config();

module.exports = {
    [process.env.NODE_ENV || "local"]: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        migrationStorageTableName: "migrations",
    }
};
