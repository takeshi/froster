import * as sqlBuilder from "./sql-builder";
import {Connection} from "./connection";
import {ModelMeta} from "./model-meta";
import * as objectMapper from "./util/object-mapper";
import * as i from "inversify";
import * as _ from "lodash";
import {Class, INewable} from "./util/class";

export let ModelModule = (kernel: i.IKernel) => {
    kernel.bind(ModelFactory).to(ModelFactory).inSingletonScope();
    kernel.bind(Model).to(Model);
}

export interface SyncOption {
    force: boolean;
}

export interface SelectOption {

}

@i.injectable()
export class ModelFactory {

    constructor(
        @i.inject(i.Kernel) private kernel: i.IKernel,
        private factory: sqlBuilder.SqlBuilderFactory) {
    }

    create<T>(clazz: INewable<T>): Model<T> {
        return this.createFromClass(Class.of(clazz));
    }

    createFromClass<T>(clazz: Class<T>): Model<T> {
        return this.kernel.get(Model).init(this.factory.createFromClass(clazz));
    }

}

@i.injectable()
export class Model<T> {

    private sqlBuilder: sqlBuilder.SqlBuilder;
    private meta: ModelMeta;

    constructor(
        public connection: Connection,
        private dataMapper: objectMapper.DataMapper
    ) {
    }

    init(sqlBiulder: sqlBuilder.SqlBuilder): this {
        this.sqlBuilder = sqlBiulder;
        this.meta = this.sqlBuilder.meta;
        return this;
    }

    async sync(option?: SyncOption) {

        option = option || {} as SyncOption;

        if (option.force) {
            await this.connection.update(
                this.sqlBuilder.drop()
            );
        }

        await this.connection.update(
            this.sqlBuilder.create()
        );

    }

    async findAll(option?: SelectOption): Promise<T[]> {
        let result = await this.connection.select<T>(
            this.sqlBuilder.select()
        );
        let properties = this.sqlBuilder.meta.columns();
        return this.dataMapper.listMapByProperties(this.sqlBuilder.meta.clazz, "id", properties, result);
    }

    async findById(id: string): Promise<T> {
        let result = await this.connection.select<T>(
            this.sqlBuilder.select() + "WHERE id = ?",
            [id]
        );
        if (result.length === 0) {
            return null;
        }
        return this.dataMapper.singleMapByProperties(this.sqlBuilder.meta.clazz, this.sqlBuilder.meta.columns(), result);
    }

    private async lastId() {
        let id = await this.connection.select("SELECT last_insert_rowid()");
        return id[0]['last_insert_rowid()'];
    }

    async insert(obj: any) {
        let params = this.sqlBuilder.meta.params(obj);
        params.push(new Date);
        params.push(new Date);
        await this.connection.update(
            this.sqlBuilder.insert(), params
        );
        let id = await this.lastId();
        return await this.findById(id);
    }
}