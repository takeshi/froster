require("reflect-metadata");
import * as mapper from "../src/orm/util/object-mapper";
import * as util from "util";
import * as entity from "./entity";
import {Class} from "../src/froster";
import * as Froster from "../src/froster";

describe("property object mapper test", () => {

    let kernel: Froster.Kernel;

    beforeEach(() => {
        kernel = Froster.createKernel();
    });

    it("DataMapper", () => {
        let datamapper = kernel.get(mapper.DataMapper);

        let account = datamapper.singleMap(Class.of(entity.口座), [
            {
                "利用者.名": "Takeshi",
                "利用者.姓": "Kondo",
                "保持銘柄.id": 1,
                "保持銘柄.銘柄名": "野村",
                "保持銘柄.タイプ": "サンプル1"
            }, {
                "利用者.名": "Takeshi",
                "利用者.姓": "Kondo",
                "保持銘柄.id": 2,
                "保持銘柄.銘柄名": "野々村",
                "保持銘柄.タイプ": "サンプル2"
            }
        ]);

        console.log("********", account);

        expect(account.利用者.名).toBe("Takeshi");
        expect(account.利用者.姓).toBe("Kondo");

        expect(account.保持銘柄.length).toBe(2);
        expect(account.保持銘柄[0].銘柄名).toBe("野村");
        expect(account.保持銘柄[0].タイプ).toBe("サンプル1")

        expect(account.保持銘柄[1].銘柄名).toBe("野々村");
        expect(account.保持銘柄[1].タイプ).toBe("サンプル2")

    });

});