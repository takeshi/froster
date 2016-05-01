import {Connection} from "./connection";

export class Transaction {

    constructor(private connection: Connection) {
    }

    commited = false;
    started = false;

    async begin(callback: (t?: Transaction) => Promise<void>) {
        await this.connection.update("BEGIN TRANSACTION;");
        try {
            this.started = true;
            await callback(this);
            if (this.commited === false) {
                await this.commit();
            }
        } catch (e) {
            try {
                if (this.commited === false) {
                    await this.rollback();
                }
            } catch (e) {
                console.error(e);
            }
            throw e;
        }
    }

    async commit() {

        if (!this.started) {
            throw new Error(`transaction not started`);
        }
        if (this.commited) {
            throw new Error(`transaction is alreday commited`);
        }
        this.commited = false;
        await this.connection.update("COMMIT;");
    }

    async rollback() {

        if (!this.started) {
            throw new Error(`transaction not started`);
        }
        if (this.commited) {
            throw new Error(`transaction is alreday commited`);
        }
        this.commited = false;
        await this.connection.update("ROLLBACK;");
    }

}