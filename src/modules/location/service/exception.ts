import { ErrorException } from '../../../system/exceptions/error-handler';

// Exception khi không tìm thấy địa điểm
export class LocationNotFoundException extends ErrorException {
    constructor() {
        super('Location not found');
        this.status = 404;
    }
}

// Exception khi địa điểm đã tồn tại
export class DuplicateLocationException extends ErrorException {
    constructor() {
        super('Location already exists');
        this.status = 409; // Conflict
    }
}
