import {Class} from "./class";
import * as i from "inversify";
import * as _ from "lodash";

export let ObjectMapperModule: i.IKernelModule = (k) => {
    k.bind(DataSetterParser).to(DataSetterParser).inSingletonScope();
    k.bind(DataMapper).to(DataMapper).inSingletonScope();
}

export class DataSetContext {
    nested: Map<string, DataSetContext> = new Map();
    constructor(
        public data: any) {
    }

    getOrCreateNestedContext(property: string) {
        let context = this.nested.get(property);
        if (!context) {
            context = new DataSetContext(this.data);
            this.nested.set(property, context);
        }
        return context;
    }

    isNewEntity(obj: any) {
        return true;
    }
}

export class DataSetter<T> {

    constructor(
        public partend: DataSetter<any>,
        public nested: DataSetter<any>,
        public clazz: Class<T>,
        public property: string,
        public fullpath: string,
        public entityIdProperty: string | number,
        public isArray: boolean
    ) {
    }

    get isRoot() {
        return this.property == null;
    }

    getEntityId(data: any) {
        return data[this.entityIdProperty];
    }

    create() {
        return new this.clazz.constructor() as T;
    }

    setData(obj: any, value: any, context: DataSetContext) {
        if (this.isRoot) {
            this.nested.setData(obj, value, context);
            return;
        }
        if (this.nested) {
            if (this.isArray) {
                let array: Array<any> = obj[this.property];
                if (!array) {
                    array = []
                    obj[this.property] = array;
                }
                let contextEntityId = this.getEntityId(context.data);
                if (array.length === 0) {
                    let entity: any = this.create();
                    array.push(entity);
                    entity.id = contextEntityId;
                }
                let nested = array[array.length - 1];
                let nestedEntityId = nested.id;
                if (nestedEntityId !== contextEntityId) {
                    nested = this.create();
                    nested.id = contextEntityId;
                    array.push(nested);
                }
                let c = context.getOrCreateNestedContext(this.property);
                this.nested.setData(nested, value, c);
            }
            else {
                let nested = obj[this.property];
                if (!nested) {
                    nested = this.create();
                    obj[this.property] = nested;
                }
                let c = context.getOrCreateNestedContext(this.property);
                this.nested.setData(nested, value, c);
            }
        } else {
            obj[this.property] = value;
        }
    }
}

@i.injectable()
export class DataSetterParser {

    cache = new Map<Class<any>, any>();

    private findOrCreateClassCache<T>(clazz: Class<T>) {
        let cache: Map<string, DataSetter<any>> = this.cache.get(clazz);
        if (!cache) {
            cache = new Map<string, DataSetter<any>>();
            this.cache.set(clazz, cache);
        }
        return cache;
    }

    parse<T>(clazz: Class<T>, property: string): DataSetter<T> {
        let classCache = this.findOrCreateClassCache(clazz);
        let cache = classCache.get(property);
        if (cache) {
            return cache;
        }

        let list = property.split('.');
        let root = new DataSetter(null, null, clazz, null, "", null, false);
        let parent: DataSetter<any> = root;

        let fullPath = null;

        for (let p of property.split('.')) {
            if (!fullPath) {
                fullPath = p;
            } else {
                fullPath += "." + p;
            }

            let nestedClass = clazz.getType(p);
            let entityId: string | number = null;
            let isArray = false;
            if (nestedClass === Class.Array) {
                nestedClass = clazz.getArrayType(p);
                entityId = fullPath + ".id";
                isArray = true;
            }
            let dataSettter = new DataSetter(parent, null, nestedClass, p, fullPath, entityId, isArray);
            parent.nested = dataSettter;
            parent = dataSettter;
        }

        classCache.set(property, root);

        return root;

    }
}

@i.injectable()
export class DataMapper {

    constructor(
        private parser: DataSetterParser
    ) {
    }

    keys(results: any[]) {
        let keys: string[] = [];
        for (let data of results) {
            _.keys(data).forEach(i => keys.push(i));
        }
        return keys;
    }

    singleMap<T>(clazz: Class<T>, results: any[]): T {
        return this.singleMapByProperties(clazz, _.uniq(this.keys(results)), results);
    }


    listMap<T>(clazz: Class<T>, idProperty: string | number, results: any[]): T[] {
        return this.listMapByProperties(clazz, idProperty, this.keys(results), results);
    }

    listMapByProperties<T>(clazz: Class<T>, idProperty: string | number, properties: string[], results: any[]): T[] {
        let list = [] as T[];
        let currentId: any;
        let currentObj: T;
        for (let result of results) {
            let id = result[idProperty];
            if (currentId !== id) {
                currentObj = new clazz.constructor;
                list.push(currentObj);
            }
            this.mapToObject(currentObj, clazz, properties, result);
        }

        return list;
    }
    singleMapByProperties<T>(clazz: Class<T>, properties: string[], results: any[]): T {
        let obj = new clazz.constructor();
        for (let result of results) {
            this.mapToObject(obj, clazz, properties, result);
        }
        return obj;
    }

    mapToObject<T>(obj: any, clazz: Class<T>, properties: string[], result: any): T {
        let context = new DataSetContext(result);
        for (let property of properties) {
            let value = result[property];
            if (!value) {
                continue;
            }
            let dataSetter = this.parser.parse(clazz, property);
            dataSetter.setData(obj, value, context);
        }
        return obj;

    }

}