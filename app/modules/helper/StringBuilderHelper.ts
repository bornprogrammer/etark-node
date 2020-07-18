export class StringBuilderHelper {

    private strArray: string[];

    constructor(str: string) {
        this.strArray = [];
        this.strArray.push(str);
    }

    public append(str: string) {
        this.strArray.push(str);
        return this;
    }

    public build(delimiter?: string) {
        delimiter = delimiter || ' ';
        return this.strArray.join(delimiter);
    }
}

export const stringBuilderHelperIns = (str: string): StringBuilderHelper => {
    return new StringBuilderHelper(str);
}
