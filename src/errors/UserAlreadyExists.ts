import { count } from "console";
import { HttpResponseError } from "./HttpResponseError";
import { HttpResponseCode } from "@app/enums/HttpResponseCodes";



export class UserAlreadyExists extends HttpResponseError {

    /**
     *
     */
    constructor() {
        super(HttpResponseCode.BAD_REQUEST, "User already exists");
    }

}