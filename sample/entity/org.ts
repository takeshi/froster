import * as froster from "../../src/froster";
import {Entity} from "./entity";
import * as _ from "lodash";

@froster.Entity()
export class 証券会社 extends Entity {
    constructor() {
        super();
    }

    @froster.Column()
    名称: string;

    @froster.Column()
    since: number;

    static of(params: {
        名称: string
    }) {
        let org = new 証券会社();
        _.extend(org, params);
        return org;
    }

}
