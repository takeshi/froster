import {Entity} from "./entity";

export class 商品 extends Entity {
    価格: number;
    名称: string;
}

export class 現物商品 extends 商品 {

}

export class 株式指標商品 extends 商品 {

}

export class デリバティブ extends 商品 {

}

export class 先物 extends デリバティブ {

    基礎商品: 基礎商品;

    安全率: number; // プライスレンジに乗じる値

    プライスキャッシュレンジ: プライスキャッシュレンジ;

    get 必要証拠金() {
        return this.プライスキャッシュレンジ.価格 * this.安全率;
    }

}

export class プライスキャッシュレンジ {

    価格: number;

    計算方式: string; // SPAN

    提供元: string; // 日本クリアリング機構

}

export abstract class 基礎商品 {

    商品: 商品;

}