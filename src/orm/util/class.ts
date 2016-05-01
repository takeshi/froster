export interface INewable<T> {
    new (...args: any[]): T;
}
export class Class<T> {

    private static Cache: Map<Function, Class<any>> = new Map<Function, Class<any>>();

    static Array = Class.of(Array);

    constructor(public constructor: INewable<T>) { }

    get name() {
        return this.constructor.name;
    }

    get prototype() {
        return this.constructor.prototype;
    }

    static of<T>(clazz: INewable<T>): Class<T> {

        let c = Class.Cache.get(clazz);

        if (c === undefined) {
            c = new Class(clazz);
            Class.Cache.set(clazz, c);
        }

        return c;

    }

    getType(property: string) {
        return Class.of(Reflect.getMetadata("design:type", this.constructor.prototype, property));
    }

    getArrayType(property: string): Class<any> {
        let type = Reflect.getMetadata("orm:arrayType", this.constructor.prototype, property);
        if (!type) {
            throw new Error(this.name + "'" + this.prototype + " has no array type");
        }
        return Class.of(type);
    }
}