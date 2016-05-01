import * as annotation from "./annotation";
import {Dialect} from "./dialect/dialect";
import * as _ from "lodash";
import * as i from "inversify";
import {Class} from "./util/class";

export let ModelMetaModule: i.IKernelModule = (kernel: i.IKernel) => {
    kernel.bind(ModelMeta).to(ModelMeta);
    kernel.bind(ModelMetaRegistry).to(ModelMetaRegistry).inSingletonScope();
}

@i.injectable()
export class ModelMetaRegistry {
    modelMetas: ModelMeta[] = [];

    append(meta: ModelMeta) {
        if (this.findFromType(meta.clazz)) {
            console.warn("dumplicate meta model registration", meta.clazz);
            return;
        }

        this.modelMetas.push(meta);
    }

    findFromType(clazz: Class<any>) {
        return this.modelMetas.find((meta) => {
            return meta.clazz.name === clazz.name;
        });
    }

}

@i.injectable()
export class ModelMeta {

    clazz: Class<any>;

    entityMeta: annotation.EntityMetadata;

    columnMeta: annotation.ColumnMetadata;

    belongsToMeta: annotation.BelongsToMetadata;

    constructor(public diarect: Dialect, public registry: ModelMetaRegistry) {
    }

    init(clazz: Class<any>) {
        this.clazz = clazz;
        this.entityMeta = annotation.EntityMetaFactory.createMeta(clazz);
        this.columnMeta = annotation.ColumnMetaFactory.createMeta(clazz);
        this.belongsToMeta = annotation.BelongsToMetaFactory.createMeta(clazz);
        this.registry.modelMetas.push(this);
        return this;
    }

    private _tableName(): string {
        return this.entityMeta.option.tableName || this.clazz.name;
    }

    tableName() {
        return this.diarect.escape(this._tableName());
    }

    params(obj: any, columns?: string[]) {
        return this.columns(columns).map(column => obj[column]);
    }

    columns(columns?: string[]): string[] {
        if (!columns) {
            return this.columnMeta.keys;
        }
        return _.intersection(this.columnMeta.keys, columns) as string[];
    }


}