import {$it, $beforeEach} from "../jasmine";
import * as froster from "../../src/froster";
import * as i from "inversify";
import * as entity from "./entity";

describe("orm test", () => {


    let kernel: froster.Kernel;

    $beforeEach(async () => {
        kernel = froster.createKernel();
        await kernel.connection.init();
    });

    $it("create table test", async () => {

        let company = kernel.model.create(entity.会社);
        let account = kernel.model.create(entity.口座);

        await company.sync({ force: true });
        await account.sync({ force: true });

    });

});