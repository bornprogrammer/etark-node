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
exports.HttpService = void 0;
const request_promise_1 = __importDefault(require("request-promise"));
const ObjectHelper_1 = require("@app/helpers/ObjectHelper");
class HttpService {
    constructor(uri, method) {
        this.call = () => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("rpOptions", this.rpOptions);
                let resp = yield request_promise_1.default(this.rpOptions);
                resp = !this.rpOptions.json ? JSON.parse(resp) : resp;
                console.log("rpOptions resp", resp);
                return resp;
            }
            catch (error) {
                console.log('http calling error', error);
                throw error;
            }
        });
        this.rpOptions = { uri, method, headers: {} };
    }
    setHeaders(key, val) {
        this.rpOptions.headers[key] = val;
        return this;
    }
    setHeadersAsObj(headers) {
        if (ObjectHelper_1.ObjectHelper.isObjectNotEmpty(headers)) {
            for (const key in headers) {
                this.rpOptions.headers[key] = headers[key];
            }
        }
        return this;
    }
    setQueryStr(obj) {
        this.rpOptions.qs = obj;
        return this;
    }
    setExpectedResponseAsJson() {
        this.rpOptions.json = true;
        return this;
    }
}
exports.HttpService = HttpService;
//# sourceMappingURL=HttpService.js.map