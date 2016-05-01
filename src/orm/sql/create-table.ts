import {ModelMeta} from "../model-meta";
import {Dialect} from "../dialect/dialect";
import * as inversify from "inversify";
import * as chai from "chai";

@inversify.injectable()
export class CreateTable {

    constructor(
        public dialect: Dialect
    ) { }

    meta: ModelMeta;

    init(meta: ModelMeta) {
        this.meta = meta;
        return this;
    }

    toSql() {
        return `
            CREATE TABLE IF NOT EXISTS ${this.meta.tableName()}
            ${this.tableColumnDef()};
       `;
    }

    private tableColumnDef() {
        return `(${this.tableColumnDefItems().join(',')})`;
    }


    private tableColumnDefItems() {
        let columns: string[] = [];

        columns.push("\`id\` INTEGER PRIMARY KEY AUTOINCREMENT");
        columns.push("\`updatedAt\` DATETIME NOT NULL");
        columns.push("\`createdAt\` DATETIME NOT NULL");

        this.meta.columnMeta.keys.map(i => this.tableItemDef(i)).forEach((column) => {
            columns.push(column);
        });

        this.meta.belongsToMeta.keys.map((key) => {

            let referenceType = this.meta.belongsToMeta.types[key];
            let referenceMeta = this.meta.registry.findFromType(referenceType);

            return this.referenceDef(key, referenceMeta.tableName());

        }).forEach(i => columns.push(i));

        return columns;
    }

    private tableItemDef(key: string) {
        return this.dialect.escape(key) + " " +
            this.dialect.dbtype(this.meta.columnMeta.types[key]);
    }

    private referenceDef(key: string, refTable: string) {
        return `\`${key}Id\` INTEGER REFERENCES ${refTable}(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`
    }
}