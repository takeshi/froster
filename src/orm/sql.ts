import * as i from "inversify";
import {DropTable} from "./sql/drop-table";
import {CreateTable} from "./sql/create-table";
import {Select} from "./sql/select";
import {Insert} from "./sql/insert";

export {DropTable} from "./sql/drop-table";
export {CreateTable} from "./sql/create-table";
export {Select} from "./sql/select";
export {Insert} from "./sql/insert";

export let SqlModule: i.IKernelModule = (kernel: i.IKernel) => {
    kernel.bind(DropTable).to(DropTable);
    kernel.bind(CreateTable).to(CreateTable);
    kernel.bind(Select).to(Select);
    kernel.bind(Insert).to(Insert);
}