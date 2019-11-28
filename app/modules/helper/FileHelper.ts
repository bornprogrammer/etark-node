class FileHelper {
    protected basePath: string;
    constructor() {
        this.basePath = '../../../app/';
    }

    public readJSONSyncUsingRequire(fileName: string) {
        const content = require(this.basePath + fileName);
        return content;
    }
}

export const fileHelperIns = new FileHelper();
