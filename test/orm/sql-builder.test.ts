// import {createKernel} from "../../src/orm/kernel";

// import {SqlBuilderFactory} from "../../src/orm/sql-builder";
// import {Connection} from "../../src/orm/connection";
// import {ModelFactory} from "../../src/orm/model";

// import * as org from "../../sample/entity/org";
// import * as i from "inversify";
// import * as entity from "./entity";

// let froster = createKernel();

// let model = froster.model.create(entity.会社);

// async function test() {
//     try {
//         await froster.connection.init();
//         await model.sync({ force: true });

//         await froster.connection.beginTransction(async () => {
//             let o = new entity.会社();
//             o.名称 = "野々村";
//             o.since = 2016;
//             await model.insert(o);
//             let obj = await model.insert({
//                 名称: "大和"
//             });
//             console.log(obj);
//             let list = await model.findAll();
//             console.log(list);
//         });
//     } catch (e) {
//         console.log(e);
//     }
// }

// test();

