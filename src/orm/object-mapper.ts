import {ModelMeta} from "./model-meta";
import * as _ from "lodash";

export class ObjectMapper {

    constructor(
        private meta: ModelMeta
    ) {

    }

    map(input: any) {

        let obj = new this.meta.clazz.constructor();
        _.extend(obj, input);

        if (obj.createdAt) {
            obj.createdAt = new Date(obj.createdAt);
        }

        if (obj.updatedAt) {
            obj.updatedAt = new Date(obj.updatedAt);
        }

        return obj;

    }

}