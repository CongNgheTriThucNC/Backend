// EmployerNotFoundException
import { ErrorException } from '../../../../system/exceptions/error-handler';

export class EmployerNotFoundException extends ErrorException {
    constructor() {
        super('Employer not found.');
        this.name = 'EmployerNotFoundException';
    }
}

// EmailAlreadyInUseException
export class EmailAlreadyInUseException extends ErrorException {
    constructor() {
        super('Email is already in use by another employer.');
        this.name = 'EmailAlreadyInUseException';
    }
}
