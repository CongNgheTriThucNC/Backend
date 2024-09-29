import { ErrorException } from '../../../../system/exceptions/error-handler';

export class EmailUserExistedException extends ErrorException {
    constructor() {
        super('Email existed');
        this.status = 404;
    }
}
