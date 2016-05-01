import * as sqlite3 from "sqlite3";
import {Transaction} from "./transaction";
import {Logger} from "./logger";
import * as i from "inversify";

export let ConnectionModule = (kernel: i.IKernel) => {
    kernel.bind(Connection).to(Connection).inSingletonScope();
}

@i.injectable()
export class Connection {

    db: sqlite3.Database;

    get inited() {
        return this.db !== null;
    }

    constructor(
        private logger: Logger
    ) {
    }

    private initCheck() {
        if (!this.inited) {
            new Error("connection not inizialized");
        }
    }

    init() {

        return new Promise<void>((done, reject) => {
            let db = new sqlite3.Database(':memory:', (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.db = db;
                done();
            });
        });

    }

    select<T>(sql: string, params?: any[]) {

        this.initCheck();
        this.logger.sql(sql, params);

        return new Promise<T[]>((done, reject) => {
            this.db.all(sql, params, (err: Error, row: T[]) => {
                if (err) {
                    reject(err);
                    return;
                }
                done(row);
            });
        });

    }

    update(sql: string, params?: any[]) {

        this.initCheck();
        this.logger.sql(sql, params);

        return new Promise<void>((done, reject) => {
            this.db.run(sql, params, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                done();
            });
        });

    }

    beginTransction(callback: (t?: Transaction) => Promise<void>) {

        this.initCheck();

        return new Promise((done, reject) => {
            this.db.serialize(() => {
                let t = new Transaction(this);
                t.begin(callback).then(() => {
                    done();
                }).catch((e) => {
                    reject(e);
                });
            })

        });

    }

}