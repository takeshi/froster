import {Entity} from "./entity";

import {口座, 先物口座} from "./account";
import {先物} from "./product";

export class 証拠金不足Error extends Error {
}

export class 金額不正Error extends Error {
}

export class 利用者 extends Entity {

    姓: string;
    名: string;

    get fullName() {
        return `${this.姓} ${this.名}`;
    }

    口座: 口座;

}

export class 先物利用者 extends 利用者 {

    口座: 先物口座;

    証拠金差し入れ(金額: number, 差し入れ元口座: 口座) {

        if (金額 <= 0) {
            throw new 金額不正Error("証拠金差し入れの金額はプラスでなければなりません");
        }

        if (差し入れ元口座.預り金 < 金額) {
            throw new 証拠金不足Error("差し入れ元口座の預り金が足りていません");
        }

        this.口座.預り金 += 金額;
        差し入れ元口座.預り金 -= 金額;

        差し入れ元口座.save();
        this.口座.save();

    }

}