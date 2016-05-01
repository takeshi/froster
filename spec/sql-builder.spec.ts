import {$it, $beforeEach} from "./jasmine";
import * as Froster from "../src/froster";
import * as i from "inversify";
import * as entity from "./entity";

describe("orm test", () => {


    let froster: Froster.Kernel;

    $beforeEach(async () => {
        froster = Froster.createKernel();
        await froster.connection.init();
    });

    $it("create table test", async () => {

        let company = froster.model.create(entity.会社);
        let account = froster.model.create(entity.口座);

        await company.sync({ force: true });
        await account.sync({ force: true });

    });

    $it("find test", async () => {
        let model = froster.model.create(entity.会社);

        await froster.connection.init();
        await model.sync({ force: true });

        await froster.connection.beginTransction(async () => {
            
            let o = new entity.会社();
            o.名称 = "野々村";
            o.since = 2016;
            await model.insert(o);

            let obj = await model.insert({
                名称: "大和",
                since: 1991
            });
            let list = await model.findAll();

            expect(list.length).toBe(2);
            expect(list[0].名称).toBe("野々村");
            expect(list[0].since).toBe(2016);
            expect(list[1].名称).toBe("大和");
            expect(list[1].since).toBe(1991);

        });

    });
});