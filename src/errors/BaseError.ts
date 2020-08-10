

export default abstract class BaseError extends Error {

    constructor(name: string, message: string) {
        super(message);
    }
}
