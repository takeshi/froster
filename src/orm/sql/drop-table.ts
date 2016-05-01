import {ModelMeta} from "../model-meta";
import * as i from "inversify";

@i.injectable()
export class DropTable {

    constructor(
    ) { }

    meta: ModelMeta;

    init(meta: ModelMeta) {
        this.meta = meta;
        return this;
    }

    toSql() {
        return `DROP TABLE IF EXISTS ${this.meta.tableName()};`
    }

}