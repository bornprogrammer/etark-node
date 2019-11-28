import { Request } from 'express';

class ResourceHelper {

    /**
     * will return the resources name
     * @param req
     */

    public getResourceName(req: any) {
        let resourceName: string = req.baseUrl;
        resourceName = resourceName.substring(resourceName.lastIndexOf('/') + 1);
        return resourceName;
    }

    /**
     *
     * @param req
     */
    public getResourceParams(req: any) {
        let resourceParams: string = req.path;
        const startInd = resourceParams.indexOf('/');
        const endInd = resourceParams.substring(startInd + 1).indexOf('/');
        if (endInd >= 0) {
            resourceParams = resourceParams.substring(startInd + 1, endInd + 1);
        } else {
            resourceParams = resourceParams.substring(startInd + 1);
        }
        return resourceParams || 'index';
    }
}

export const resourceHelperIns = new ResourceHelper();
