import {ModelMeta} from "../model-meta";
import {Dialect} from "../dialect/dialect";
import * as i from "inversify";

@i.injectable()
export class Insert {

    meta: ModelMeta

    constructor(
        public dialect: Dialect
    ) { }

    init(meta: ModelMeta) {
        this.meta = meta;
        return this;
    }

    toSql() {
        return `
            INSERT INTO ${this.meta.tableName()} 
            (${this.insertParams()} , createdAt , updatedAt ) 
            VALUES (${this.bindingParams()} , ? , ? )
        `;
    }

    private params(obj: any) {
        return this.meta.params(obj);
    }

    private bindingParams() {
        return this.meta.columns().map(() => "?").join(',');
    }

    private insertParams() {
        return this.meta.columns().map(this.dialect.escape).join(',');
    }

}