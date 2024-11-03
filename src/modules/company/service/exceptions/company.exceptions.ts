import { ErrorException } from '../../../../system/exceptions/error-handler';

export class CompanyNotFoundException extends ErrorException {
    constructor() {
        super('Company not found.');
        this.name = 'CompanyNotFoundException';
    }
}
