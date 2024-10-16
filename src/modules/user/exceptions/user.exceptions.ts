import { ErrorException } from '../../../system/exceptions/error-handler';

export class UserNotFoundException extends ErrorException {
    constructor() {
        super('User not found');
        this.status = 404;
    }
}

export class EmailAlreadyInUseException extends ErrorException {
    constructor() {
        super('Email is already in use');
        this.status = 409;
    }
}
