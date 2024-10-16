import { ErrorException } from '../../../../system/exceptions/error-handler';

export class JobNotFoundException extends ErrorException {
    constructor() {
        super('Job not found.');
        this.name = 'JobNotFoundException';
    }
}
