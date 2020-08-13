import { GoogleDistanceMapApiEntity } from "@app/entities/GoogleDistanceMapApiEntity";
import ArrayHelper from "@app/helpers/ArrayHelper";
import config from "config";
import { httpGetServiceIns } from "@app/http-services/HttpGetService";
import { GoogleDistanceMapApiHttpResponse } from "@app/entities/GoogleDistanceMapApiHttpResponse";

export class GoogleDistanceMapApiService {

    private queryStrParams: any;

    constructor() {
        this.queryStrParams = { origins: "", destinations: "", units: "metric", key: config.get('google_map.google_map_key') };
    }

    public getDistance = async (googleDistanceMapApiEntityOrigin: GoogleDistanceMapApiEntity[], googleDistanceMapApiEntityDes: GoogleDistanceMapApiEntity[]) => {
        let result = await httpGetServiceIns(config.get('google_map_api_url')).setQueryStr(this.buildQueryStr(googleDistanceMapApiEntityOrigin, googleDistanceMapApiEntityDes)).setExpectedResponseAsJson().call();
        return result;
    }

    public getMinDistance = async (googleDistanceMapApiEntityOrigin: GoogleDistanceMapApiEntity[], googleDistanceMapApiEntityDes: GoogleDistanceMapApiEntity[]) => {
        let result: GoogleDistanceMapApiHttpResponse = await this.getDistance(googleDistanceMapApiEntityOrigin, googleDistanceMapApiEntityDes);
        let minDistance = 1000000;
        if (result) {
            result.rows[0].elements.forEach(item => {
                if (item.distance.value < minDistance) {
                    minDistance = item.distance.value;
                }
            });
        }
        return minDistance;
    }

    private buildQueryStr = (googleDistanceMapApiEntityOrigin: GoogleDistanceMapApiEntity[], googleDistanceMapApiEntityDes: GoogleDistanceMapApiEntity[]) => {
        let queryStrParams = Object.assign({}, this.queryStrParams);
        if (ArrayHelper.isArrayValid(googleDistanceMapApiEntityOrigin) && ArrayHelper.isArrayValid(googleDistanceMapApiEntityDes)) {
            queryStrParams.origins = this.buildLatNLongIntoFormat(googleDistanceMapApiEntityOrigin);
            queryStrParams.destinations = this.buildLatNLongIntoFormat(googleDistanceMapApiEntityDes);
        }
        return queryStrParams;
    }

    private buildLatNLongIntoFormat = (googleDistanceMapApiEntity: GoogleDistanceMapApiEntity[]): string => {
        let latsNLongs = [];
        if (ArrayHelper.isArrayValid(googleDistanceMapApiEntity)) {
            googleDistanceMapApiEntity.forEach(item => {
                let str = item.lat + ", " + item.long;
                latsNLongs.push(str);
            });
        }
        return latsNLongs.join("|");
    }
}

export const googleDistanceMapApiServiceIns = new GoogleDistanceMapApiService();