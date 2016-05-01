export abstract class Type {
    static DefualtMapping = {
        String: StringType,
        Number: DecimalType,
        Date: DateType
    }

    constructor(public _defaultType: string) {
    }

}

export class StringType extends Type {
    constructor() {
        super("VARCHAR(255)");
    }
}

export class DecimalType extends Type {
}

export class DateType extends Type {
}
