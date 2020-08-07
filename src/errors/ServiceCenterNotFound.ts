import { HttpResponseError } from "./HttpResponseError";
import { HttpResponseCode } from "@app/enums/HttpResponseCodes";


export class ServiceCenterNotFound extends HttpResponseError {
    constructor() {
        super(HttpResponseCode.RESOURCES_CREATED, "we are not serving at selected location");
    }
}