require("reflect-metadata");

import * as i from "inversify";
import * as sqlBuilder from "./sql-builder";
import * as dialect from "./dialect/dialect";
import * as model from "./model";
import * as conn from "./connection";
import * as sql from "./sql";
import * as meta from "./model-meta";
import * as logger from "./logger";
import * as objectMapper from "./util/object-mapper";
import * as clazz from "./util/class";

export let CoreModules: i.IKernelModule = (k) => {

    k.load(sqlBuilder.SqlBuilderModule);
    k.load(model.ModelModule);
    k.load(sql.SqlModule);
    k.load(conn.ConnectionModule);
    k.load(meta.ModelMetaModule);
    k.load(logger.LoggerModule);
    k.load(objectMapper.ObjectMapperModule);

    k.bind(dialect.Dialect).to(dialect.Dialect);

    k.bind(i.Kernel).toConstantValue(k);

};

export class Kernel {

    constructor(public kernel: i.IKernel) {
    }

    get<T>(identifer: clazz.INewable<T>): T {
        return this.kernel.get(identifer);
    }

    get connection() {
        return this.kernel.get(conn.Connection);
    }

    get model() {
        return this.kernel.get(model.ModelRegistry);
    }

}

export interface KernelOption {



}

export function createKernel(option?: KernelOption) {
    let kernel = new i.Kernel();
    kernel.load(CoreModules);
    return new Kernel(kernel);
}
