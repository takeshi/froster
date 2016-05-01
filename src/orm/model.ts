import * as sqlBuilder from "./sql-builder";
import {Connection} from "./connection";
import {ModelMeta} from "./model-meta";
import {ObjectMapper} from "./object-mapper";
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

    create<T>(clazz: INewable<any>) {
        return this.createFromClass(Class.of(clazz));
    }

    createFromClass<T>(clazz: Class<any>) {
        return this.kernel.get(Model).init(this.factory.createFromClass(clazz));
    }

}

@i.injectable()
export class Model<T> {

    private sqlBuilder: sqlBuilder.SqlBuilder;
    private meta: ModelMeta;
    private mapper: ObjectMapper;

    constructor(
        public connection: Connection) {
    }

    init(sqlBiulder: sqlBuilder.SqlBuilder): this {
        this.sqlBuilder = sqlBiulder;
        this.meta = this.sqlBuilder.meta;
        this.mapper = new ObjectMapper(this.meta);
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

        return result.map(i => this.mapper.map(i)) as T[];
    }

    async findById(id: string): Promise<T> {
        let result = await this.connection.select<T>(
            this.sqlBuilder.select() + "WHERE id = ?",
            [id]
        );
        if (result.length === 0) {
            return null;
        }
        return this.mapper.map(result[0]) as T;
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