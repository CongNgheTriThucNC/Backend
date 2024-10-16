import { ErrorException } from '../../../../system/exceptions/error-handler';

export class JobRequirementNotFoundException extends ErrorException {
    constructor() {
        super('Requirement not found.');
        this.name = 'JobRequirement';
    }
}
