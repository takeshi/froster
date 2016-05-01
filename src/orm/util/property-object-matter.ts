import {Class} from "./class";
import * as i from "inversify";

export let PropertyObjectMapperModule: i.IKernelModule = (k) => {

}

export class DataSetter<T> {
    constructor(
        public partend: DataSetter<any>,
        public nested: DataSetter<any>,
        public clazz: Class<T>,
        public property: string | number) {
    }

    get isRoot() {
        return this.property == null;
    }

    create() {
        return new this.clazz.constructor() as T;
    }

    set(obj: any, value: any) {
        if (this.isRoot) {
            this.nested.set(obj, value);
            return;
        }

        if (this.nested) {
            let nested = obj[this.property];
            if (!nested) {
                nested = this.create();
                obj[this.property] = nested;
            }
            this.nested.set(nested, value);
        } else {
            obj[this.property] = value;
        }
    }
}

export class DataSetterParser {

    parse<T>(clazz: Class<T>, property: string) {
        let list = property.split('.');
        let root = new DataSetter(null, null, clazz, null);
        let parent: DataSetter<any> = root;
        for (let p of property.split('.')) {
            let listValue = p.split('[');
            if (listValue.length > 2) {
                throw new Error('parse error ' + property);
            }
            if (listValue.length === 2) {
                try {
                    if (!parent) {
                        throw new Error("parse error " + property);
                    }
                    let index = parseInt(listValue[1].split(']')[0]);

                    let nestedProperty = listValue[0];
                    let dataSetter = new DataSetter(parent, null, Class.Array, nestedProperty);
                    parent.nested = dataSetter;
                    parent = dataSetter;

                    let arrayType = clazz.getArrayType(nestedProperty);
                    dataSetter = new DataSetter(parent, null, arrayType, index);
                    parent.nested = dataSetter;
                    parent = dataSetter;

                } catch (e) {
                    console.error('parse error ' + property, e);
                    throw new Error('parse error ' + property);
                }
            }
            else {
                let nestedClass = clazz.getType(p)
                let dataSettter = new DataSetter(parent, null, nestedClass, p);
                parent.nested = dataSettter;
                parent = dataSettter;
            }
        }
        return root;
    }
}