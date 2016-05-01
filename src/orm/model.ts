import * as sqlBuilder from "./sql-builder";
import {Connection} from "./connection";
import {ModelMeta} from "./model-meta";
import * as objectMapper from "./util/object-mapper";
import * as i from "inversify";
import * as _ from "lodash";
import {Class, INewable} from "./util/class";

export let ModelModule = (kernel: i.IKernel) => {
    kernel.bind(ModelRegistry).to(ModelRegistry).inSingletonScope();
    kernel.bind(Model).to(Model);
}

export interface SyncOption {
    force: boolean;
}

export interface SelectOption {

}

@i.injectable()
export class ModelRegistry {

    cache: Map<Class<any>, Model<any>> = new Map();

    constructor(
        @i.inject(i.Kernel) private kernel: i.IKernel,
        private sqlBuilderFactory: sqlBuilder.SqlBuilderFactory) {
    }

    create<T>(clazz: INewable<T>): Model<T> {
        return this.getOrCreate(Class.of(clazz));
    }

    getOrCreate<T>(clazz: Class<T>): Model<T> {
        let model = this.cache.get(clazz);
        if (!model) {
            model = this.kernel.get(Model).init(this.sqlBuilderFactory.create(clazz));
            this.cache.set(clazz, model);
        }
        return model;
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