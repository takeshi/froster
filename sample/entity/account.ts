import * as froster from "../../src/froster";

import {Entity} from "./entity";

import {証券会社} from "./org";
import {利用者} from "./user";
import {先物} from "./product";


@froster.Entity()
export class 口座 extends Entity {
    constructor() {
        super();
    }

    証券会社: 証券会社;

    利用者: 利用者;

    預り金: number;

}

@froster.Entity()
export class 先物口座 extends 口座 {

    constructor() {
        super();
    }

    先物口座商品: 先物口座商品[];


    get 証拠金(): number {
        return this.預り金;
    }

    set 証拠金(金額: number) {
        this.預り金 = 金額;
    }

}

@froster.Entity()
export class 先物口座商品 {

    static create(先物: 先物) {
        let instance = new 先物口座商品();
        instance.商品 = 先物;
        return instance;
    }

    商品: 先物;

}