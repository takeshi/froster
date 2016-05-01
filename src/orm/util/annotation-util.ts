require("reflect-metadata");
import * as meta from "reflect-metadata";
import {Class} from "./class";

export class FieldMetaData<OPTION> {
    options: { [key: string]: OPTION };
    types: { [key: string]: any };
    keys: string[];
}

export class FieldMetadataFactory<OPTION> {

    private key: string;
    private arrayKey: string;

    constructor(key: string) {
        this.key = FieldMetadataFactory + key;
        this.arrayKey = this.key + ":array";
        this.decorator = this.decorator.bind(this);
        this.arrayDecorator = this.decorator.bind(this);
        this.get = this.get.bind(this);
    }

    createMeta(clazz: Class<any>) {
        let meta = new FieldMetaData<OPTION>();
        meta.keys = this.keys(clazz);
        meta.options = this.get(clazz);
        meta.types = this.getTypes(clazz);
        return meta;
    }

    keys(clazz: Class<any>): string[] {
        return this._keys(clazz.prototype);
    }

    private _keys(prototype: any): string[] {
        if (!prototype[this.arrayKey]) {
            prototype[this.arrayKey] = [];
        }
        return prototype[this.arrayKey];
    }

    decorator(options?: OPTION) {
        options = options || {} as OPTION;
        return (prototype: any, key: string) => {
            this._keys(prototype).push(key);
            Reflect.defineMetadata(this.key, options, prototype, key)
        }
    }

    arrayDecorator(target, options?: OPTION) {
        return (prototype: any, key: string) => {
            this._keys(prototype).push(key);
            Reflect.defineMetadata(this.key, options, prototype, key);
            Reflect.defineMetadata("orm:arrayType", target, prototype, key);
        }
    }

    get(clazz: any): { [key: string]: OPTION } {
        let meta: any = {};
        this._keys(clazz.prototype).forEach((key) => {
            meta[key] = Reflect.getMetadata(this.key, clazz.prototype, key)
        });
        return meta;
    }

    getTypes(clazz: Class<any>): { [key: string]: any } {
        let meta: any = {};
        this._keys(clazz.prototype).forEach((key) => {
            meta[key] = Reflect.getMetadata("design:type", clazz.prototype, key)
        });
        return meta;
    }

}

export class ClassMetadata<OPTION> {
    option: OPTION
    parameterTypes: any[];

}

export class ClassMetadataFactory<OPTION>{
    private key: string;

    constructor(key: string) {
        this.key = ClassMetadataFactory + key;
        this.decorator = this.decorator.bind(this);
        this.get = this.get.bind(this);
    }



    createMeta(clazz: Class<any>) {
        let meta = new ClassMetadata<OPTION>();
        meta.option = this.get(clazz);
        meta.parameterTypes = ClassMetadataFactory.getParameters(clazz);
        return meta;
    }

    decorator(options?: OPTION) {
        options = options || {} as OPTION;
        return Reflect.metadata(this.key, options);
    }

    get(clazz: Class<any>): OPTION {
        return Reflect.getMetadata(this.key, clazz.constructor);
    }

    static getParameters(clazz: Class<any>): any[] {
        return Reflect.getMetadata("design:paramtypes", clazz.constructor);
    }

}
