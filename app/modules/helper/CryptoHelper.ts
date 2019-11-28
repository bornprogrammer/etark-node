import crypto from 'crypto';
export class CryptoHelper {

    public static randomValueHex(len: number) {
        return crypto
            .randomBytes(Math.ceil(len / 2))
            .toString('hex') // convert to hexadecimal format
            .slice(0, len); // return required number of characters
    }
}
