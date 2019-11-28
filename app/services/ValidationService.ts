import BaseService from '@app/services/BaseService';

// import iValidator from '../validation/iValidator';

export default class ValdiationService extends BaseService {

    private schema;

    constructor() {
        super();
    }
    public setSchema(schema: any) {
        this.schema = schema;
    }

    public getSchema() {

    }

    public validate() {

    }

}
