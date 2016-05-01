import * as froster from "..//src/froster";
import * as _ from "lodash";

@froster.Entity()
export class 会社 {
    constructor() {
    }

    @froster.Column()
    名称: string;

    @froster.Column()
    since: number;

    static of(params: {
        名称: string
    }) {
        let org = new 会社();
        _.extend(org, params);
        return org;
    }

}

@froster.Entity()
export class 利用者 {

    @froster.Column()
    名: string;

    @froster.Column()
    姓: string;

}

@froster.Entity()
export class 株 {

    @froster.Column()
    銘柄名: string;

    @froster.Column()
    タイプ: string;

}

@froster.Entity()
export class 口座 {

    @froster.HasOne()
    利用者: 利用者;

    @froster.BelongsTo()
    会社: 会社;

    @froster.Column()
    名称: string;

    @froster.HasMany(株)
    保持銘柄: 株[];

}
