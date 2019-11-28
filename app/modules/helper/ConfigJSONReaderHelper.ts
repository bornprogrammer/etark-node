import { fileHelperIns } from './FileHelper';

class ConfigJSONReaderHelper {

    private basePath = 'config/';

    public read(fileName: string) {
        const path = this.basePath + fileName;
        const config = fileHelperIns.readJSONSyncUsingRequire(path);
        return config;
    }

}

export const configJSONReaderHelperIns = new ConfigJSONReaderHelper();
