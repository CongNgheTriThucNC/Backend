import { ErrorException } from '../../../../system/exceptions/error-handler';

export class JobApplicationNotFoundException extends ErrorException {
    constructor() {
        super('Requirement not found.');
        this.name = 'JobRequirement';
    }
}
