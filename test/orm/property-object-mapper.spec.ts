require("reflect-metadata");
import * as mapper from "../../src/orm/util/property-object-matter";
import * as util from "util";
import * as entity from "./entity";
import {Class} from "../../src/froster";

describe("property object mapper test", () => {

    it("mapping", () => {
        let parser = new mapper.DataSetterParser();

        let firstName = parser.parse(Class.of(entity.口座), "利用者.名");
        let familyName = parser.parse(Class.of(entity.口座), "利用者.姓");

        let account = firstName.create() as entity.口座;

        firstName.set(account, "Takeshi");
        familyName.set(account, "Kondo");

        expect("Takeshi").toBe(account.利用者.名);
        expect("Kondo").toBe(account.利用者.姓);

    });

});