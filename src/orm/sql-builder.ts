import * as modelMeta from "./model-meta";
import {Dialect} from "./dialect/dialect";
import {Select} from "./sql/select";
import {CreateTable} from "./sql/create-table";
import {DropTable} from "./sql/drop-table";
import {Insert} from "./sql/insert";
import * as i from "inversify";
import * as sql from "./sql";
import {Class} from "./util/class";

export let SqlBuilderModule = (k: i.IKernel) => {
    k.bind(SqlBuilderFactory).to(SqlBuilderFactory).inSingletonScope();
    k.bind(SqlBuilder).to(SqlBuilder);
};

@i.injectable()
export class SqlBuilderFactory {

    constructor(
        @i.inject(i.Kernel) private kernel: i.IKernel) {
    }

    create<T>(clazz: Class<T>) {
        return this.kernel.get(SqlBuilder).init(
            this.kernel.get(modelMeta.ModelMeta).init(clazz)
        );
    }

}

@i.injectable()
export class SqlBuilder {


    meta: modelMeta.ModelMeta;

    constructor(
        public selectSql: Select,
        public dropTable: DropTable,
        public createTable: CreateTable,
        public insertSql: Insert,
        public dialect: Dialect
    ) {
    }

    init(meta: modelMeta.ModelMeta): this {
        this.meta = meta;
        this.selectSql.init(meta);
        this.dropTable.init(meta);
        this.createTable.init(meta);
        this.dropTable.init(meta);
        this.insertSql.init(meta);
        return this;
    }

    select(): string {
        return this.selectSql.toSql();
    }

    drop(): string {
        return this.dropTable.toSql();
    }

    create(): string {
        return this.createTable.toSql();
    }

    insert(): string {
        return this.insertSql.toSql();
    }
}