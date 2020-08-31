import UnAuthorized from "./UnAuthorized";



export class EmailNotFoundError extends UnAuthorized {
    /**
     *
     */
    constructor() {
        super("Email not registered");
    }
}