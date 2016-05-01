import * as i from "inversify";

@i.injectable()
export class Dialect {
    escape(x: string) {
        return `\`${x}\``;
    }

    dbtype(type: any) {
        switch (type) {
            case String:
                return 'VARCHAR(255)';
            case Number:
                return "DECIMAL";
        }
    }
}