import * as Sequelize from "sequelize";

export var db =
    new Sequelize(
        'database',
        'username',
        'password',
        {
            dialect: "sqlite",
            storage: 'build/database.sqlite'
        }
    );

export function defineRelation(func: () => void) {
    initRelations.push(func);
}

let initRelations: (() => void)[] = [];

export function init() {
    initRelations.forEach((func) => {
        func();
    });
}