import { configJSONReaderHelperIns } from '@app/modules/helper/ConfigJSONReaderHelper';

export class ConfigReaderService {

    protected configData: any;

    constructor(configFileName) {
        this.configData = configJSONReaderHelperIns.read(configFileName);
    }

    public getConfigurations() {
        return this.configData;
    }
}