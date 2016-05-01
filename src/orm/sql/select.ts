import {ModelMeta} from "../model-meta";
import {Dialect} from "../dialect/dialect";
import * as i from "inversify";

@i.injectable()
export class Select {

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
            SELECT ${this.selectParams()}
            FROM   ${this.meta.tableName()}
        `;
    }

    private selectParams() {
        let params: string[] = [];
        params.push('id');
        params.push("createdAt");
        params.push("updatedAt");
        this.meta.columns().map(this.dialect.escape)
            .forEach(i => params.push(i));
        return params.join(',');
    }

}