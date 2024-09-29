import { ErrorException } from '../../../../system/exceptions/error-handler';

export class IncorrectLoginException extends ErrorException {
    constructor() {
        super('Email or password is incorrect');
        this.status = 401;
    }
}
