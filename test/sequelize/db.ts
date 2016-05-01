import * as sequelize from "sequelize";

export let db = new sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    // SQLite only
    storage: 'database.sqlite'
});
