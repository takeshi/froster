export class StringUtil {
    static trim(str: string) {
        return str.replace(/\r|\n/g, " ").replace(/( |\t)+/g, " ").trim();
    }
}
