import {db} from "./db";
import * as sequelize from "sequelize";

export let Sample = db.define("Sample", {
    test: sequelize.STRING
});

export let Sample2 = db.define("Sample", {
    test: sequelize.STRING
});

Sample2.belongsTo(Sample);

export async function sync() {
    Sample.sync({ force: true });
    Sample2.sync({ force: true });
}