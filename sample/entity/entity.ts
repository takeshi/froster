import * as Sequelize from "sequelize";
import {db} from "../db";


function methodList(clazz: any) {
    let methods: any = {};

    for (let name in clazz.prototype) {
        methods[name] = clazz.prototype.name;
    }

    return methods;
}

export abstract class Entity {

    id: string;

    save(options?: Sequelize.InstanceSaveOptions): Promise<this> {
        throw new Error("saveメソッドはOverrideしてください");
    };

    static define<I, M>(clazz: any, attr: Sequelize.DefineAttributes) {
        return db.define<I, M>(
            clazz.name,
            attr,
            {
                freezeTableName: true,
                instanceMethods: methodList(clazz)
            }
        );
    }

}
