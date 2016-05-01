import * as froster from "../src/froster";
import * as entity from "./entity";

describe("class spec", () => {

    it("get array type", () => {

        let accountClass = froster.Class.of(entity.口座);

        let have = accountClass.getArrayType("保持銘柄");

        expect(have).toBe(froster.Class.of(entity.株));
        
    })
})