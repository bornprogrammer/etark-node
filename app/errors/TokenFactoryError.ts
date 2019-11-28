// does it imports the instance of the class
import { TokenNotFoundError } from '@app/errors/TokenNotFoundError';
import { TokenNotSentError } from '@app/errors/TokenNotSentError';

export class TokenFactoryError {

    constructor(error: Error) {
        if (error instanceof TokenNotSentError) {
            throw TokenNotSentError;
        } else if (error instanceof TokenNotFoundError) {
            throw TokenNotFoundError;
        } else {
            throw error;
        }
    }
}
