import {Entity} from "./entity";

import {先物利用者} from "./user";
import {先物} from "./product";
import {先物口座商品} from "./account";

export class 証拠金不足Error extends Error {

}


class 購入取引 extends Entity {
    constructor() {
        super();
    }

    購入者: 先物利用者;
    商品: 先物;

    取引済み: boolean = false;

    private 証拠金が足りているか() {
        return this.購入者.口座.証拠金 > this.商品.必要証拠金;
    }

    取引実行() {

        if (this.証拠金が足りているか() === false) {
            throw new 証拠金不足Error("証拠金が足りていません");
        }

        this.購入者.口座.証拠金 -= this.商品.必要証拠金;

        let 購入商品 = 先物口座商品.create(this.商品);
        this.購入者.口座.先物口座商品.push(購入商品);

        this.購入者.口座.save();
        this.save();

        this.取引済み = true;

    }

}

class 売却 {

}

