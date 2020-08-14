"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleDistanceMapApiServiceIns = exports.GoogleDistanceMapApiService = void 0;
const ArrayHelper_1 = __importDefault(require("@app/helpers/ArrayHelper"));
const config_1 = __importDefault(require("config"));
const HttpGetService_1 = require("@app/http-services/HttpGetService");
class GoogleDistanceMapApiService {
    constructor() {
        this.getDistance = (googleDistanceMapApiEntityOrigin, googleDistanceMapApiEntityDes) => __awaiter(this, void 0, void 0, function* () {
            let result = yield HttpGetService_1.httpGetServiceIns(config_1.default.get('google_map_api_url')).setQueryStr(this.buildQueryStr(googleDistanceMapApiEntityOrigin, googleDistanceMapApiEntityDes)).setExpectedResponseAsJson().call();
            return result;
        });
        this.getMinDistanceForServiceCenter = (googleDistanceMapApiEntityOrigin, googleDistanceMapApiEntityDes) => __awaiter(this, void 0, void 0, function* () {
            let result = yield this.getDistance(googleDistanceMapApiEntityOrigin, googleDistanceMapApiEntityDes);
            let minDistance = 1000000;
            let minDestIndex = 0;
            if (result) {
                result.rows[0].elements.forEach((item, index) => {
                    if (item.distance.value < minDistance) {
                        minDistance = item.distance.value;
                        minDestIndex = index;
                    }
                });
            }
            return { distance: minDistance, distanceKM: minDistance / 1000, minDestIndex: minDestIndex };
        });
        this.buildQueryStr = (googleDistanceMapApiEntityOrigin, googleDistanceMapApiEntityDes) => {
            let queryStrParams = Object.assign({}, this.queryStrParams);
            if (ArrayHelper_1.default.isArrayValid(googleDistanceMapApiEntityOrigin) && ArrayHelper_1.default.isArrayValid(googleDistanceMapApiEntityDes)) {
                queryStrParams.origins = this.buildLatNLongIntoFormat(googleDistanceMapApiEntityOrigin);
                queryStrParams.destinations = this.buildLatNLongIntoFormat(googleDistanceMapApiEntityDes);
            }
            return queryStrParams;
        };
        this.buildLatNLongIntoFormat = (googleDistanceMapApiEntity) => {
            let latsNLongs = [];
            if (ArrayHelper_1.default.isArrayValid(googleDistanceMapApiEntity)) {
                googleDistanceMapApiEntity.forEach(item => {
                    let str = item.lat + ", " + item.long;
                    latsNLongs.push(str);
                });
            }
            return latsNLongs.join("|");
        };
        this.queryStrParams = { origins: "", destinations: "", units: "metric", key: config_1.default.get('google_map.google_map_key') };
    }
}
exports.GoogleDistanceMapApiService = GoogleDistanceMapApiService;
exports.googleDistanceMapApiServiceIns = new GoogleDistanceMapApiService();
//# sourceMappingURL=GoogleDistanceMapApiService.js.map