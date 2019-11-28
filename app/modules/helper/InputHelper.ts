class InputHelper {

    public isInputValid(input: any): boolean {
        let isInputValid = true;
        if (input === null || input === undefined || input === '' || (input instanceof Array && input.length === 0) || (input instanceof Object && Object.keys(input).length === 0)) {
            isInputValid = false;
        }
        return isInputValid;
    }

    public isObjectValidNNotEmpty(input: object) {
        let isObjectValid = false;
        if (input && (input instanceof Object && Object.keys(input).length > 0)) {
            isObjectValid = true;
        }
        return isObjectValid;
    }

    public isArrayValidNNotEmpty(input: object) {
        let isArrayValid = false;
        if (input && (input instanceof Array && input.length > 0)) {
            isArrayValid = true;
        }
        return isArrayValid;
    }

    public escapeRegExp(text) {
        return text.replace(/[-[\]{}()*+'?.,\\^$|#\s]/g, '\\$&');
    }
}

export const inputHelperIns = new InputHelper();
