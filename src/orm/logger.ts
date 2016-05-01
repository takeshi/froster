import * as i from "inversify";

export class Logger {

    info(msg: any) {
    }

    warn(msg: any) {
    }

    error(msg: any) {
    }

    sql(sql: string, params: any[]) {
    }

}

export let LoggerModule: i.IKernelModule = (k) => {
    k.bind(Logger).toDynamicValue(() => {
        return LoggerManager.logger;
    })
}

@i.injectable()
export class ConsoleLogger implements Logger {

    info() {
        console.info.apply(null, arguments);
    }

    warn(msg: any) {
        console.warn.apply(null, arguments);
    }

    error(msg: any) {
        console.error.apply(null, arguments);
    }

    sql(sql: string, params: any) {
        if (params) {
            console.info('[SQL]', sql, params);
        } else {
            console.info('[SQL]', sql);
        }
    }

}

export class LoggerManager {

    static logger = new ConsoleLogger();

}
